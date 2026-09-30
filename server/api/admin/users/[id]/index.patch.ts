export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const user = await findSupportUser(getRouterParam(event, "id"));
  await rateLimit(`admin:update:${admin.id}`, 60, 60);

  const body = (await readBody<Record<string, unknown>>(event)) ?? {};
  const prenom = readString(body, "prenom");
  const nom = readString(body, "nom") || null;
  const email = readString(body, "email");
  assertName(prenom, "Prénom");
  if (nom) assertName(nom, "Nom");
  assertEmail(email);
  const emailVerified = body.emailVerified === true;
  const logout = body.logout === true;

  // Pour l'historique : chaque champ changé, avec sa valeur avant et après.
  const yesNo = (value: boolean) => (value ? "oui" : "non");
  const changes: FieldChange[] = [
    { field: "prenom", before: user.prenom, after: prenom },
    { field: "nom", before: user.nom, after: nom },
    { field: "email", before: user.email, after: email.toLowerCase() },
    { field: "emailVerified", before: yesNo(user.email_verified), after: yesNo(emailVerified) },
  ].filter((change) => change.before !== change.after);
  if (logout) changes.push({ field: "logout", before: null, after: "oui" });

  try {
    await updateUserByAdmin(user.id, { prenom, nom, email, emailVerified, logout });
  } catch (error) {
    if (isUniqueViolation(error))
      throw createError({ statusCode: 409, message: "Cet email est déjà utilisé par un autre compte." });
    throw error;
  }
  if (changes.length)
    await logAdminAction(admin.id, "user.update", user.id, { changes });
  return { ok: true };
});
