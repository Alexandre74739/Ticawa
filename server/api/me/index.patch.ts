export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  await rateLimit(`profile:${user.id}`, 20, 60 * 60);

  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const prenom = readString(body, "prenom");
  const nom = readString(body, "nom") || null;
  assertName(prenom, "Prénom");
  if (nom) assertName(nom, "Nom");

  const row = await updateProfile(user.id, { prenom, nom });
  if (!row) throw createError({ statusCode: 404, message: "Compte introuvable." });
  await setUserSession(event, { user: toSessionUser(row) });
  return { prenom: row.prenom, nom: row.nom };
});
