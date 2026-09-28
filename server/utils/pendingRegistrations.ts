export const REGISTRATION_TTL_MINUTES = 60;
export const REGISTRATION_MAX_PER_HOUR = 3;

export interface PendingRegistration {
  email: string;
  prenom: string;
  nom: string;
  passwordHash: string;
}

interface SealedPayload extends PendingRegistration {
  exp: number;
}

const IV_LENGTH = 12;

async function key() {
  const { session } = useRuntimeConfig();
  if (!session.password) throw new Error("NUXT_SESSION_PASSWORD manquante");

  const material = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`ticawa:inscription:${session.password}`),
  );
  return crypto.subtle.importKey("raw", material, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function sealRegistration(data: PendingRegistration) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const payload: SealedPayload = {
    ...data,
    exp: Date.now() + REGISTRATION_TTL_MINUTES * 60_000,
  };

  const body = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      await key(),
      new TextEncoder().encode(JSON.stringify(payload)),
    ),
  );

  const sealed = new Uint8Array(iv.length + body.length);
  sealed.set(iv);
  sealed.set(body, iv.length);
  return toBase64Url(sealed);
}

export async function unsealRegistration(token: string) {
  try {
    const raw = fromBase64Url(token);
    const body = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: raw.subarray(0, IV_LENGTH) },
      await key(),
      raw.subarray(IV_LENGTH),
    );

    const payload: SealedPayload = JSON.parse(new TextDecoder().decode(body));
    return payload.exp > Date.now() ? payload : undefined;
  } catch {
    return undefined;
  }
}
