export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const row = await findUserById(user.id);
  if (!row) throw createError({ statusCode: 404, message: "Compte introuvable." });

  const resets = await listPasswordResets(row.id);
  const settings = await findUserSettings(row.id);
  const tickets = await listTicketsForExport(row.id);
  const devices = await listPushSubscriptions(row.id);
  const reminders = await listRemindersForExport(row.id);
  const now = new Date();

  setResponseHeaders(event, {
    "content-type": "application/json; charset=utf-8",
    "content-disposition": `attachment; filename="ticawa-export-${now.toISOString().slice(0, 10)}.json"`,
    "cache-control": "no-store",
  });

  return JSON.stringify(
    {
      service: "Ticawa",
      exporteLe: now,
      compte: {
        id: row.id,
        prenom: row.prenom,
        nom: row.nom,
        email: row.email,
        role: row.role,
        inscritLe: row.created_at,
        connexionParMotDePasse: Boolean(row.password_hash),
        connexionGoogle: Boolean(row.google_id),
      },
      parametres: {
        ...toSettings(settings),
        modifiesLe: settings?.updated_at ?? null,
      },
      demandesDeMotDePasse: resets.map((r) => ({
        demandeLe: r.created_at,
        expireLe: r.expires_at,
        utiliseLe: r.used_at,
      })),
      appareilsNotifies: devices.map((d) => ({
        abonneLe: d.createdAt,
        serviceDePush: new URL(d.endpoint).hostname,
      })),
      rappelsEnvoyes: reminders,
      tickets,
    },
    null,
    2,
  );
});
