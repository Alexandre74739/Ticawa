export const PASSWORD_MIN = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readString(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export function assertEmail(email: string) {
  if (!EMAIL_RE.test(email) || email.length > 254)
    throw createError({ statusCode: 400, message: "Adresse email invalide." });
}
