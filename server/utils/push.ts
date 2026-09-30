import { createCipheriv, createECDH, createHmac, createPrivateKey, randomBytes, sign } from "node:crypto";

// Web Push sans dépendance : signature VAPID (RFC 8292) et chiffrement aes128gcm
// (RFC 8291). Le service de push du téléphone ne voit qu'un contenu chiffré.

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

const b64url = (data: Buffer | string) => Buffer.from(data).toString("base64url");

function hkdf(salt: Buffer, ikm: Buffer, info: string | Buffer, length: number) {
  const prk = createHmac("sha256", salt).update(ikm).digest();
  return createHmac("sha256", prk).update(Buffer.concat([Buffer.from(info), Buffer.from([1])])).digest().subarray(0, length);
}

function encrypt(payload: string, target: PushTarget) {
  const clientKey = Buffer.from(target.p256dh, "base64url");
  const ecdh = createECDH("prime256v1");
  const serverKey = ecdh.generateKeys();
  const salt = randomBytes(16);
  const ikm = hkdf(
    Buffer.from(target.auth, "base64url"),
    ecdh.computeSecret(clientKey),
    Buffer.concat([Buffer.from("WebPush: info\0"), clientKey, serverKey]),
    32,
  );
  const cipher = createCipheriv(
    "aes-128-gcm",
    hkdf(salt, ikm, "Content-Encoding: aes128gcm\0", 16),
    hkdf(salt, ikm, "Content-Encoding: nonce\0", 12),
  );
  const body = Buffer.concat([cipher.update(payload + "\x02"), cipher.final(), cipher.getAuthTag()]);
  const header = Buffer.alloc(21);
  salt.copy(header);
  header.writeUInt32BE(4096, 16);
  header.writeUInt8(serverKey.length, 20);
  return Buffer.concat([header, serverKey, body]);
}

function vapidToken(audience: string, publicKey: string, privateKey: string) {
  const pub = Buffer.from(publicKey, "base64url");
  const key = createPrivateKey({
    key: { kty: "EC", crv: "P-256", d: privateKey, x: b64url(pub.subarray(1, 33)), y: b64url(pub.subarray(33)) },
    format: "jwk",
  });
  const claims = { aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "mailto:contact@ticawa.fr" };
  const unsigned = `${b64url(JSON.stringify({ typ: "JWT", alg: "ES256" }))}.${b64url(JSON.stringify(claims))}`;
  return `${unsigned}.${b64url(sign("sha256", Buffer.from(unsigned), { key, dsaEncoding: "ieee-p1363" }))}`;
}

// On n'envoie jamais de requête ailleurs que chez un service de push connu.
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

// Envoie à tous les appareils du compte, efface ceux qui n'existent plus.
export async function pushToUser(userId: string, message: PushMessage) {
  const keys = vapidKeys();
  if (!keys) return 0;
  let sent = 0;
  for (const target of await listPushSubscriptions(userId)) {
    try {
      const response = await fetch(target.endpoint, {
        method: "POST",
        headers: {
          Authorization: `vapid t=${vapidToken(new URL(target.endpoint).origin, keys.publicKey, keys.privateKey)}, k=${keys.publicKey}`,
          "Content-Encoding": "aes128gcm",
          "Content-Type": "application/octet-stream",
          // Téléphone éteint : le rappel reste en attente 4 jours.
          TTL: String(4 * 86400),
        },
        body: encrypt(JSON.stringify(message), target),
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
