// Lien de changement d'email : jeton signé (sans table), valable 1 h, lié à
// l'adresse actuelle : il devient invalide dès que l'email a changé.
export const EMAIL_CHANGE_TTL_MINUTES = 60;

const text = new TextEncoder();
const toB64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64 = (value: string) =>
  Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

function key() {
  const { session } = useRuntimeConfig();
  return crypto.subtle.importKey(
    "raw",
    text.encode(`ticawa:email:${session.password}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

interface Payload {
  userId: string;
  from: string;
  to: string;
  exp: number;
}

export async function createEmailChangeToken(user: UserRow, to: string) {
  const payload: Payload = { userId: user.id, from: user.email, to, exp: Date.now() + EMAIL_CHANGE_TTL_MINUTES * 60_000 };
  const body = toB64(text.encode(JSON.stringify(payload)));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await key(), text.encode(body)));
  return `${body}.${toB64(signature)}`;
}

export async function readEmailChangeToken(token: unknown, user: UserRow) {
  const [body, signature] = typeof token === "string" ? token.split(".") : [];
  let payload: Payload | null = null;
  try {
    if (body && signature && (await crypto.subtle.verify("HMAC", await key(), fromB64(signature), text.encode(body))))
      payload = JSON.parse(new TextDecoder().decode(fromB64(body)));
  } catch {}
  if (!payload || payload.userId !== user.id || payload.from !== user.email || payload.exp < Date.now())
    throw createError({ statusCode: 400, message: "Ce lien n'est plus valable. Refaites la demande depuis votre compte." });
  return payload.to;
}
