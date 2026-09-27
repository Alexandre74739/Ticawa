export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const row = await findUserById(user.id);
  if (!row) throw createError({ statusCode: 404, message: "Compte introuvable." });

  return {
    prenom: row.prenom,
    nom: row.nom,
    email: row.email,
    password: Boolean(row.password_hash),
    createdAt: row.created_at,
  };
});
