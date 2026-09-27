export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const token = readString(body, "token");
  const password = typeof body.password === "string" ? body.password : "";

  await rateLimit(`reset:ip:${clientIp(event)}`, 10, 15 * 60);
  assertPassword(password);

  const userId = token ? await consumePasswordReset(token) : undefined;
  const user = userId
    ? await resetPassword(userId, await hashPassword(password))
    : undefined;
  if (!user)
    throw createError({
      statusCode: 400,
      message: "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.",
    });

  await startSession(event, user);
  return { ok: true };
});
