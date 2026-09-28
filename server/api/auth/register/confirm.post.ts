export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const token = readString(body, "token");

  await rateLimit(`register-confirm:ip:${clientIp(event)}`, 10, 15 * 60);

  const pending = token ? await unsealRegistration(token) : undefined;
  if (!pending)
    throw createError({
      statusCode: 400,
      message: "Ce lien a expiré. Recommencez votre inscription.",
    });

  try {
    const user = await createUser({
      email: pending.email,
      prenom: pending.prenom,
      nom: pending.nom,
      passwordHash: pending.passwordHash,
      emailVerified: true,
    });
    await startSession(event, user);
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error))
      throw createError({
        statusCode: 409,
        message: "Votre compte est déjà créé. Connectez-vous.",
      });
    throw error;
  }
});
