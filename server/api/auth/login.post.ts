let dummyHash: Promise<string> | undefined;

export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const email = readString(body, "email").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  const invalid = createError({
    statusCode: 401,
    message: "Email ou mot de passe incorrect.",
  });
  if (!email || !password || email.length > 254 || password.length > 200)
    throw invalid;

  await rateLimit(`login:ip:${clientIp(event)}`, 20, 15 * 60);
  await rateLimit(`login:email:${email}`, 10, 15 * 60);

  const user = await findUserByEmail(email);
  if (!user?.password_hash) {
    dummyHash ??= hashPassword("ticawa-dummy-password");
    await verifyPassword(await dummyHash, password);
    throw invalid;
  }
  if (!(await verifyPassword(user.password_hash, password))) throw invalid;

  if (passwordNeedsReHash(user.password_hash))
    await updatePasswordHash(user.id, await hashPassword(password));

  await startSession(event, user);
  return { ok: true };
});
