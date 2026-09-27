async function sendResetLink(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return false;
  if ((await countRecentPasswordResets(user.id)) >= PASSWORD_RESET_MAX_PER_HOUR)
    return false;
  await sendPasswordResetMail(user, await createPasswordReset(user.id));
  return true;
}

export default defineEventHandler(async (event) => {
  const { user: sessionUser } = await getUserSession(event);

  if (sessionUser) {
    let sent: boolean;
    try {
      sent = await sendResetLink(sessionUser.email);
    } catch (error) {
      console.error("[password/request]", error);
      throw createError({
        statusCode: 500,
        message: import.meta.dev
          ? `Envoi échoué : ${(error as Error).message}`
          : "L'envoi du mail a échoué. Réessayez dans un instant.",
      });
    }
    if (!sent)
      throw createError({
        statusCode: 429,
        message: `Vous avez déjà reçu ${PASSWORD_RESET_MAX_PER_HOUR} liens cette heure-ci. Vérifiez vos mails (et vos spams).`,
      });
    return { ok: true };
  }

  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const email = readString(body, "email").toLowerCase();
  assertEmail(email);
  await rateLimit(`reset-request:ip:${clientIp(event)}`, 5, 15 * 60);

  if (import.meta.dev) {
    await sendResetLink(email);
    return { ok: true };
  }

  event.waitUntil(
    sendResetLink(email).catch((error) =>
      console.error("[password/request]", error),
    ),
  );
  return { ok: true };
});
