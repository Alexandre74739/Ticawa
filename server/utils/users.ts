import type { User } from "#auth-utils";

export interface UserRow {
  id: string;
  email: string;
  prenom: string;
  nom: string | null;
  password_hash: string | null;
  google_id: string | null;
  role: "user" | "admin";
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
    insert into users (email, prenom, nom, password_hash, google_id)
    values (
      ${data.email.toLowerCase()},
      ${data.prenom},
      ${data.nom ?? null},
      ${data.passwordHash ?? null},
      ${data.googleId ?? null}
    )
    returning *
  `;
  return user!;
}

export async function linkGoogleAccount(id: string, googleId: string) {
  const [user] = await useDb()<UserRow[]>`
    update users set google_id = ${googleId} where id = ${id} returning *
  `;
  return user!;
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
