export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = (await readBody<{ endpoint?: unknown }>(event)) ?? {};
  if (typeof body.endpoint !== "string" || body.endpoint.length > 1000)
    throw createError({ statusCode: 400, message: "Abonnement introuvable." });

  await deletePushSubscription(user.id, body.endpoint);
  return { ok: true };
});
