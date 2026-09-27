export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const prenom = readString(body, "prenom");
  const nom = readString(body, "nom");
  const email = readString(body, "email").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!prenom || !nom)
    throw createError({ statusCode: 400, message: "Prénom et nom obligatoires." });
  assertName(prenom, "Prénom");
  assertName(nom, "Nom");
  assertEmail(email);
  assertPassword(password);
  if (body.cgu !== true)
    throw createError({
      statusCode: 400,
      message: "Vous devez accepter les CGU et la politique de confidentialité.",
    });

  await rateLimit(`register:ip:${clientIp(event)}`, 10, 60 * 60);

  const existing = await findUserByEmail(email);
  if (existing)
    throw createError({
      statusCode: 409,
      message: existing.password_hash
        ? "Un compte existe déjà avec cet email. Connectez-vous."
        : "Un compte Google existe déjà avec cet email. Utilisez « Continuer avec Google ».",
    });

  try {
    const user = await createUser({
      email,
      prenom,
      nom,
      passwordHash: await hashPassword(password),
    });
    await startSession(event, user);
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error))
      throw createError({ statusCode: 409, message: "Un compte existe déjà avec cet email." });
    throw error;
  }
});
