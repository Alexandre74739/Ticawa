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

  const send = async () => {
    if (
      !(await consumeQuota(
        `register:email:${email}`,
        REGISTRATION_MAX_PER_HOUR,
        60 * 60,
      ))
    )
      return;

    const existing = await findUserByEmail(email);
    if (existing) return sendAccountExistsMail(existing);

    const pending = {
      email,
      prenom,
      nom,
      passwordHash: await hashPassword(password),
    };
    await sendRegistrationMail(pending, await sealRegistration(pending));
  };

  if (import.meta.dev) await send();
  else
    event.waitUntil(send().catch((error) => console.error("[register]", error)));

  return { ok: true };
});
