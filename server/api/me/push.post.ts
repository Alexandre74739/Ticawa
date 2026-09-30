export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  await rateLimit(`push:${user.id}`, 20, 60 * 60);

  if (!vapidKeys())
    throw createError({
      statusCode: 503,
      message: "Les notifications sur téléphone ne sont pas encore disponibles.",
    });

  await savePushSubscription(user.id, readPushSubscription(await readBody(event)));
  return { ok: true };
});
