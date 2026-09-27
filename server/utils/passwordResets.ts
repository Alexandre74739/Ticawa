export const PASSWORD_RESET_TTL_MINUTES = 60;
export const PASSWORD_RESET_MAX_PER_HOUR = 3;

export interface PasswordResetRow {
  created_at: Date;
  expires_at: Date;
  used_at: Date | null;
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function createPasswordReset(userId: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60_000);
  await useDb()`
    insert into password_resets (user_id, token_hash, expires_at)
    values (${userId}, ${await hashToken(token)}, ${expiresAt})
  `;
  return token;
}

export async function countRecentPasswordResets(userId: string) {
  const [row] = await useDb()<{ count: number }[]>`
    select count(*)::int as count from password_resets
    where user_id = ${userId} and created_at > now() - interval '1 hour'
  `;
  return row!.count;
}

export async function consumePasswordReset(token: string) {
  const [row] = await useDb()<{ user_id: string }[]>`
    update password_resets set used_at = now()
    where token_hash = ${await hashToken(token)}
      and used_at is null
      and expires_at > now()
    returning user_id
  `;
  if (!row) return undefined;

  await useDb()`
    update password_resets set used_at = now()
    where user_id = ${row.user_id} and used_at is null
  `;
  return row.user_id;
}

export async function listPasswordResets(userId: string) {
  return useDb()<PasswordResetRow[]>`
    select created_at, expires_at, used_at from password_resets
    where user_id = ${userId}
    order by created_at desc
  `;
}
