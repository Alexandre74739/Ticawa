import type { User } from "#auth-utils";

export interface UserRow {
  id: string;
  email: string;
  prenom: string;
  nom: string | null;
  password_hash: string | null;
  google_id: string | null;
  role: "user" | "admin";
  email_verified: boolean;
  session_version: number;
  created_at: Date;
}

export async function findUserByEmail(email: string) {
  const [user] = await useDb()<UserRow[]>`
    select * from users where email = ${email.toLowerCase()}
  `;
  return user;
}

export async function findUserByGoogleId(googleId: string) {
  const [user] = await useDb()<UserRow[]>`
    select * from users where google_id = ${googleId}
  `;
  return user;
}

export async function findUserById(id: string) {
  const [user] = await useDb()<UserRow[]>`
    select * from users where id = ${id}
  `;
  return user;
}

export async function createUser(data: {
  email: string;
  prenom: string;
  nom?: string | null;
  passwordHash?: string | null;
  googleId?: string | null;
}) {
  const [user] = await useDb()<UserRow[]>`
    insert into users (email, prenom, nom, password_hash, google_id, email_verified)
    values (
      ${data.email.toLowerCase()},
      ${data.prenom},
      ${data.nom ?? null},
      ${data.passwordHash ?? null},
      ${data.googleId ?? null},
      ${Boolean(data.googleId)}
    )
    returning *
  `;
  return user!;
}

export async function linkGoogleAccount(id: string, googleId: string) {
  const [user] = await useDb()<UserRow[]>`
    update users set
      google_id = ${googleId},
      password_hash = case when email_verified then password_hash else null end,
      session_version = case when email_verified then session_version else session_version + 1 end,
      email_verified = true
    where id = ${id}
    returning *
  `;
  return user!;
}

export async function resetPassword(id: string, passwordHash: string) {
  const [user] = await useDb()<UserRow[]>`
    update users set
      password_hash = ${passwordHash},
      email_verified = true,
      session_version = session_version + 1
    where id = ${id}
    returning *
  `;
  return user;
}

export async function getSessionVersion(id: string) {
  const [row] = await useDb()<{ session_version: number }[]>`
    select session_version from users where id = ${id}
  `;
  return row?.session_version;
}

export async function updatePasswordHash(id: string, passwordHash: string) {
  await useDb()`update users set password_hash = ${passwordHash} where id = ${id}`;
}

export function toSessionUser(user: UserRow): User {
  return {
    id: user.id,
    email: user.email,
    prenom: user.prenom,
    role: user.role,
  };
}

export function isUniqueViolation(error: unknown) {
  return (error as { code?: string })?.code === "23505";
}

export async function deleteUser(id: string) {
  await useDb()`delete from users where id = ${id}`;
}
