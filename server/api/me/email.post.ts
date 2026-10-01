export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  await rateLimit(`email-change:${user.id}`, 3, 60 * 60);

  const email = readString((await readBody<Record<string, unknown>>(event)) ?? {}, "email").toLowerCase();
  assertEmail(email);
  const row = await findUserById(user.id);
  if (!row) throw createError({ statusCode: 404, message: "Compte introuvable." });
  if (email === row.email)
    throw createError({ statusCode: 400, message: "C'est déjà votre adresse actuelle." });
  if (await findUserByEmail(email))
    throw createError({ statusCode: 409, message: "Cet email est déjà utilisé par un autre compte." });

  await sendEmailChangeMail(row, email, await createEmailChangeToken(row, email));
  return { ok: true };
});
