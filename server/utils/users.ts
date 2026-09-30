import type { User } from "#auth-utils";
import type { H3Event } from "h3";

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
  emailVerified?: boolean;
}) {
  const [user] = await useDb()<UserRow[]>`
    insert into users (email, prenom, nom, password_hash, google_id, email_verified)
    values (
      ${data.email.toLowerCase()},
      ${data.prenom},
      ${data.nom ?? null},
      ${data.passwordHash ?? null},
      ${data.googleId ?? null},
      ${data.emailVerified ?? Boolean(data.googleId)}
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

export async function requireAdmin(event: H3Event) {
  const { user } = await requireUserSession(event);
  const row = await findUserById(user.id);
  if (row?.role !== "admin")
    throw createError({ statusCode: 403, message: "Accès réservé aux admins." });
  return row;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findSupportUser(id: string | undefined) {
  const user = id && UUID_RE.test(id) ? await findUserById(id) : undefined;
  if (user?.role !== "user")
    throw createError({ statusCode: 404, message: "Utilisateur introuvable." });
  return user;
}

const USERS_PAGE_SIZE = 20;

export async function listUsers(search: string, page: number) {
  const sql = useDb();
  const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
  const filter = search
    ? sql`and (
        f_unaccent(u.prenom) like f_unaccent(${pattern})
        or f_unaccent(u.nom) like f_unaccent(${pattern})
        or u.email like lower(${pattern})
      )`
    : sql``;

  const [rows, [counts]] = await Promise.all([
    sql<{ id: string; prenom: string; nom: string | null; email: string; createdAt: Date; ticketCount: number }[]>`
      select u.id, u.prenom, u.nom, u.email, u.created_at as "createdAt",
        (select count(*)::int from tickets t where t.user_id = u.id) as "ticketCount"
      from users u
      where u.role = 'user' ${filter}
      order by u.created_at desc, u.id
      limit ${USERS_PAGE_SIZE} offset ${(page - 1) * USERS_PAGE_SIZE}
    `,
    sql<{ total: number }[]>`
      select count(*)::int as total from users u where u.role = 'user' ${filter}
    `,
  ]);

  return {
    items: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    total: counts!.total,
    pages: Math.max(1, Math.ceil(counts!.total / USERS_PAGE_SIZE)),
  };
}

export async function updateUserByAdmin(
  id: string,
  data: { prenom: string; nom: string | null; email: string; emailVerified: boolean; logout: boolean },
) {
  const [user] = await useDb()<UserRow[]>`
    update users set
      prenom = ${data.prenom},
      nom = ${data.nom},
      email = ${data.email.toLowerCase()},
      email_verified = ${data.emailVerified},
      session_version = session_version + ${data.logout ? 1 : 0}
    where id = ${id} and role = 'user'
    returning *
  `;
  return user;
}
