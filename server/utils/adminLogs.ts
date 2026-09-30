import type { AdminAction, AdminLog, AdminLogKind, FieldChange } from "#shared/types/adminLog";

// Historique des actions admin qui modifient les données d'un utilisateur
// (RGPD : traçabilité). Lecture seule depuis l'app, effacé au bout d'un an.

// Les emails sont copiés au moment de l'action : ils restent lisibles même
// après la suppression du compte concerné.
export async function logAdminAction(
  adminId: string,
  action: AdminAction,
  targetUserId: string,
  extra: { ticketId?: string; changes?: FieldChange[] } = {},
) {
  const sql = useDb();
  await sql`
    insert into admin_logs (admin_id, admin_email, action, target_user_id, target_email, ticket_id, changes)
    select a.id, a.email, ${action}, u.id, u.email, ${extra.ticketId ?? null},
      ${sql.json(extra.changes ?? [])}
    from users a, users u
    where a.id = ${adminId} and u.id = ${targetUserId}
  `;

  if (Math.random() < 0.01)
    await sql`delete from admin_logs where created_at < now() - interval '1 year'`;
}

const LOGS_PAGE_SIZE = 20;

export async function listAdminLogs(search: string, page: number, kind: AdminLogKind | null) {
  const sql = useDb();
  const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
  const filter = sql`
    ${search ? sql`and (l.admin_email like lower(${pattern}) or l.target_email like lower(${pattern}))` : sql``}
    ${kind ? sql`and l.action in ${sql([`user.${kind}`, `ticket.${kind}`])}` : sql``}
  `;

  const [rows, [counts]] = await Promise.all([
    sql<(Omit<AdminLog, "createdAt"> & { createdAt: Date })[]>`
      select l.id::text, l.admin_email as "adminEmail", l.action,
        l.target_user_id as "targetUserId", l.target_email as "targetEmail",
        exists (select 1 from users u where u.id = l.target_user_id) as "targetExists",
        l.changes, l.created_at as "createdAt"
      from admin_logs l
      where true ${filter}
      order by l.created_at desc, l.id desc
      limit ${LOGS_PAGE_SIZE} offset ${(page - 1) * LOGS_PAGE_SIZE}
    `,
    sql<{ total: number }[]>`
      select count(*)::int as total from admin_logs l where true ${filter}
    `,
  ]);

  return {
    items: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    total: counts!.total,
    pages: Math.max(1, Math.ceil(counts!.total / LOGS_PAGE_SIZE)),
  };
}
