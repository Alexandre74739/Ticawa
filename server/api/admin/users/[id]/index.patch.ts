export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const user = await findSupportUser(getRouterParam(event, "id"));
  await rateLimit(`admin:update:${admin.id}`, 60, 60);

  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const prenom = readString(body, "prenom");
  const nom = readString(body, "nom") || null;
  const email = readString(body, "email");
  assertName(prenom, "Prénom");
  if (nom) assertName(nom, "Nom");
  assertEmail(email);

  try {
    await updateUserByAdmin(user.id, {
      prenom,
      nom,
      email,
      emailVerified: body.emailVerified === true,
      logout: body.logout === true,
    });
  } catch (error) {
    if (isUniqueViolation(error))
      throw createError({ statusCode: 409, message: "Cet email est déjà utilisé par un autre compte." });
    throw error;
  }
  return { ok: true };
});
