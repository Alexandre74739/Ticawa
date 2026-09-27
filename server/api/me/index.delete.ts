const DELETE_WORD = "SUPPRIMER";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = (await readBody<Record<string, unknown>>(event)) ?? {};

  await rateLimit(`delete:${user.id}`, 5, 15 * 60);

  if (readString(body, "confirmation").toUpperCase() !== DELETE_WORD)
    throw createError({
      statusCode: 400,
      message: `Tapez « ${DELETE_WORD} » pour confirmer.`,
    });

  await deleteUser(user.id);
  await clearUserSession(event);
  return { ok: true };
});
