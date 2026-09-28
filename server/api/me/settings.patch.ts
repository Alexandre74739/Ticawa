export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};

  await rateLimit(`settings:${user.id}`, 60, 60);

  const next = toSettings(await findUserSettings(user.id));
  for (const key of SETTING_KEYS) {
    if (!(key in body)) continue;
    const value = body[key];
    if (typeof value !== "boolean")
      throw createError({ statusCode: 400, message: "Réglage invalide." });
    next[key] = value;
  }

  if (next.notifications && !next.channelPush && !next.channelEmail)
    throw createError({
      statusCode: 400,
      message: "Gardez au moins un canal pour recevoir les alertes.",
    });

  return toSettings(await saveUserSettings(user.id, next));
});
