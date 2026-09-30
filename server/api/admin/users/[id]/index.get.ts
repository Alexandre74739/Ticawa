export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const user = await findSupportUser(getRouterParam(event, "id"));
  const { q, page, status } = getQuery(event);

  const search = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const current = Math.min(Math.max(Math.floor(Number(page)) || 1, 1), 10_000);
  const state = status === "active" || status === "expired" ? status : null;
  const [settings, tickets] = await Promise.all([
    findUserSettings(user.id),
    listTickets(user.id, search, current, state),
  ]);

  // Jamais le hash du mot de passe, l'identifiant Google ni la version de session.
  return {
    id: user.id,
    prenom: user.prenom,
    nom: user.nom,
    email: user.email,
    emailVerified: user.email_verified,
    password: Boolean(user.password_hash),
    google: Boolean(user.google_id),
    createdAt: user.created_at.toISOString(),
    settings: toSettings(settings),
    tickets,
  };
});
