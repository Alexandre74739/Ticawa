export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const row = await findUserById(user.id);
  if (!row) throw createError({ statusCode: 404, message: "Compte introuvable." });

  const email = await readEmailChangeToken((await readBody<{ token?: unknown }>(event))?.token, row);
  let updated: UserRow | undefined;
  try {
    updated = await updateEmail(row.id, email);
  } catch (error) {
    if (isUniqueViolation(error))
      throw createError({ statusCode: 409, message: "Cet email est déjà utilisé par un autre compte." });
    throw error;
  }
  if (!updated) throw createError({ statusCode: 404, message: "Compte introuvable." });

  await setUserSession(event, { user: toSessionUser(updated) });
  await sendEmailChangedNotice(row, email).catch((error) => console.error("[email/confirm]", error));
  return { email };
});
