interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushMessage {
  title: string;
  body: string;
  url: string;
  tag?: string;
}

const { subtle } = crypto;
const text = new TextEncoder();
const EC = { name: "ECDH", namedCurve: "P-256" } as const;
type Bytes = Uint8Array<ArrayBuffer>;

const toB64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64 = (value: string) =>
  Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

function concat(...parts: Bytes[]) {
  const out = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  parts.reduce((offset, part) => (out.set(part, offset), offset + part.length), 0);
  return out;
}

async function hkdf(salt: Bytes, ikm: Bytes, info: Bytes, length: number) {
  const key = await subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, length * 8));
}

async function encrypt(payload: string, target: PushTarget) {
  const clientKey = fromB64(target.p256dh);
  const server = await subtle.generateKey(EC, true, ["deriveBits"]);
  const serverKey = new Uint8Array(await subtle.exportKey("raw", server.publicKey));
  const client = await subtle.importKey("raw", clientKey, EC, false, []);
  const secret = new Uint8Array(await subtle.deriveBits({ name: "ECDH", public: client }, server.privateKey, 256));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const ikm = await hkdf(fromB64(target.auth), secret, concat(text.encode("WebPush: info\0"), clientKey, serverKey), 32);
  const cek = await hkdf(salt, ikm, text.encode("Content-Encoding: aes128gcm\0"), 16);
  const iv = await hkdf(salt, ikm, text.encode("Content-Encoding: nonce\0"), 12);
  const aes = await subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const body = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, aes, concat(text.encode(payload), new Uint8Array([2]))));
  const header = new Uint8Array(21);
  header.set(salt);
  new DataView(header.buffer).setUint32(16, 4096);
  header[20] = serverKey.length;
  return concat(header, serverKey, body);
}

async function vapidToken(audience: string, publicKey: string, privateKey: string) {
  const pub = fromB64(publicKey);
  const key = await subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", d: privateKey, x: toB64(pub.slice(1, 33)), y: toB64(pub.slice(33)) },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const part = (value: object) => toB64(text.encode(JSON.stringify(value)));
  const claims = { aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "mailto:contact@ticawa.fr" };
  const unsigned = `${part({ typ: "JWT", alg: "ES256" })}.${part(claims)}`;
  const signature = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, text.encode(unsigned));
  return `${unsigned}.${toB64(new Uint8Array(signature))}`;
}

const PUSH_HOST = /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|.+\.notify\.windows\.com)$/;

export function vapidKeys() {
  const { vapidPrivateKey, public: pub } = useRuntimeConfig();
  return vapidPrivateKey && pub.vapidPublicKey ? { publicKey: pub.vapidPublicKey, privateKey: vapidPrivateKey } : null;
}

export function readPushSubscription(body: unknown): PushTarget {
  const { endpoint, keys } = (body ?? {}) as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  const valid = (value: unknown, max: number) => typeof value === "string" && value.length <= max && /^[\w-]+=*$/.test(value);
  let host = "";
  try {
    const url = new URL(String(endpoint));
    if (url.protocol === "https:") host = url.hostname;
  } catch {}
  if (!PUSH_HOST.test(host) || String(endpoint).length > 1000 || !valid(keys?.p256dh, 200) || !valid(keys?.auth, 100))
    throw createError({ statusCode: 400, message: "Abonnement aux notifications invalide." });
  return { endpoint: String(endpoint), p256dh: keys!.p256dh as string, auth: keys!.auth as string };
}

export async function savePushSubscription(userId: string, target: PushTarget) {
  await useDb()`
    insert into push_subscriptions ${useDb()({ user_id: userId, ...target })}
    on conflict (endpoint) do update set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth
  `;
}

export async function deletePushSubscription(userId: string, endpoint: string) {
  await useDb()`delete from push_subscriptions where endpoint = ${endpoint} and user_id = ${userId}`;
}

export function listPushSubscriptions(userId: string) {
  return useDb()<(PushTarget & { createdAt: Date })[]>`
    select endpoint, p256dh, auth, created_at as "createdAt"
    from push_subscriptions where user_id = ${userId} order by created_at
  `;
}

export async function pushToUser(userId: string, message: PushMessage) {
  const keys = vapidKeys();
  if (!keys) return 0;
  let sent = 0;
  for (const target of await listPushSubscriptions(userId)) {
    try {
      const jwt = await vapidToken(new URL(target.endpoint).origin, keys.publicKey, keys.privateKey);
      const response = await fetch(target.endpoint, {
        method: "POST",
        headers: {
          Authorization: `vapid t=${jwt}, k=${keys.publicKey}`,
          "Content-Encoding": "aes128gcm",
          "Content-Type": "application/octet-stream",
          TTL: String(4 * 86400),
        },
        body: await encrypt(JSON.stringify(message), target),
      });
      if (response.status === 404 || response.status === 410)
        await useDb()`delete from push_subscriptions where endpoint = ${target.endpoint}`;
      else if (response.ok) sent++;
      else console.error("[push]", response.status, await response.text());
    } catch (error) {
      console.error("[push]", (error as Error).message);
    }
  }
  return sent;
}
