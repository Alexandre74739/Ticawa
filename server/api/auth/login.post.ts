export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const email = readString(body, "email").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  const invalid = createError({
    statusCode: 401,
    message: "Email ou mot de passe incorrect.",
  });
  if (!email || !password) throw invalid;

  const user = await findUserByEmail(email);
  if (!user) throw invalid;
  if (!user.password_hash)
    throw createError({
      statusCode: 401,
      message: "Ce compte utilise Google. Cliquez sur « Continuer avec Google ».",
    });
  if (!(await verifyPassword(user.password_hash, password))) throw invalid;

  if (passwordNeedsReHash(user.password_hash))
    await updatePasswordHash(user.id, await hashPassword(password));

  await setUserSession(event, { user: toSessionUser(user) });
  return { ok: true };
});
