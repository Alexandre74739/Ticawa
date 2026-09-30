import type { CoverageKind } from "#shared/types/ticket";
import type { PushMessage } from "./push";

export interface ReminderItem {
  ticketId: string;
  title: string;
  kind: CoverageKind;
  date: string;
  daysLeft: number;
  daysBefore: number;
}

interface DueRow extends Omit<ReminderItem, "title"> {
  userId: string;
  name: string | null;
  merchant: string | null;
  items: { label: string; totalPrice: number | null }[];
  email: string;
  prenom: string;
  push: boolean;
  mail: boolean;
}

// Ce qu'il y a à faire, dit simplement. Tico conseille, il n'agit pas.
export const ADVICE: Record<CoverageKind, string> = {
  return: "Vous voulez le rapporter ? Passez au magasin avec le ticket, il est dans Ticawa. Après cette date, le magasin n'est plus obligé de l'accepter.",
  legal: "Vérifiez qu'il fonctionne bien. En cas de panne ou de défaut, le magasin doit le réparer ou le remplacer gratuitement : montrez-lui la preuve d'achat gardée dans Ticawa.",
  commercial: "Un souci ? Contactez le vendeur ou la marque avec la preuve d'achat gardée dans Ticawa.",
  insurance: "En cas de casse ou de vol, déclarez-le à l'assureur avant cette date.",
};

// « jusqu'à aujourd'hui », « jusqu'à demain », « jusqu'au 1er octobre 2026 ».
export function until({ date, daysLeft }: Pick<ReminderItem, "date" | "daysLeft">) {
  if (daysLeft <= 0) return "jusqu'à aujourd'hui";
  if (daysLeft === 1) return "jusqu'à demain";
  const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return `jusqu'au ${day.replace(/^1 /, "1er ")}`;
}

// Le nom donné par l'utilisateur, sinon l'objet couvert le plus cher et le magasin.
function reminderTitle({ name, merchant, items }: DueRow) {
  if (name) return name;
  const everyday = isEverydayStore(merchant);
  const main = items
    .filter((item) => isDurable(item, everyday))
    .sort((a, b) => (b.totalPrice ?? 0) - (a.totalPrice ?? 0))[0];
  if (main && merchant) return `${main.label} (${merchant})`;
  return main?.label ?? merchant ?? "Un achat";
}

// Comptes de test : aucun mail ne peut arriver sur ces domaines réservés.
const UNDELIVERABLE = /\.(test|example|invalid|localhost)$/i;
const MIN_WARRANTY_AMOUNT = 20;

// Échéances qui franchissent un palier (échange : J-3 et J-1 ; le reste : J-30
// et J-7) sans rappel déjà envoyé. Tico ne relance pas pour des courses, pour
// une garantie de moins de 20 €, ni pour une garantie relayée par une plus longue.
async function findDueReminders() {
  return useDb()<DueRow[]>`
    with due as (
      select t.id as ticket_id, t.user_id, t.name, t.merchant,
        coalesce((
          select json_agg(json_build_object('label', i.label, 'totalPrice', i.total_price::float) order by i.position)
          from ticket_items i where i.ticket_id = t.id
        ), '[]') as items,
        c.kind, c.date, c.date - current_date as days_left
      from tickets t cross join lateral ${coverageRows()}
      where c.date between current_date and current_date + 30
        and not coalesce(c.kind = 'return' and t.legal_warranty = 'none', false)
        and not coalesce(c.kind in ('legal', 'commercial') and t.total_amount < ${MIN_WARRANTY_AMOUNT}::numeric, false)
        and not coalesce(c.kind = 'legal' and t.warranty_months > 24, false)
        and not coalesce(c.kind = 'commercial' and t.warranty_months <= 24 and t.legal_warranty = 'new', false)
    )
    select d.ticket_id as "ticketId", d.user_id as "userId", d.name, d.merchant, d.items, d.kind,
      d.date::text as date, d.days_left as "daysLeft", step.days_before as "daysBefore",
      u.email, u.prenom,
      coalesce(s.channel_push, false) as push,
      coalesce(s.channel_email, true) as mail
    from due d
    join users u on u.id = d.user_id
    left join user_settings s on s.user_id = d.user_id
    cross join lateral (
      select min(o) as days_before
      from unnest(case when d.kind = 'return' then array[3, 1] else array[30, 7] end) as o
      where o >= d.days_left
    ) step
    where coalesce(s.notifications, true)
      and step.days_before is not null
      and not exists (
        select 1 from reminder_log r
        where r.ticket_id = d.ticket_id and r.kind = d.kind
          and r.deadline = d.date and r.days_before <= step.days_before
      )
    order by d.user_id, d.date, d.ticket_id
  `;
}

export function listRemindersForExport(userId: string) {
  return useDb()`
    select r.ticket_id as "ticketId", r.kind, r.deadline::text as "finLe",
      r.days_before as "joursAvant", r.sent_at as "envoyeLe"
    from reminder_log r join tickets t on t.id = r.ticket_id
    where t.user_id = ${userId}
    order by r.sent_at
  `;
}

function pushMessage(items: ReminderItem[]): PushMessage {
  const [first] = items as [ReminderItem];
  if (items.length === 1)
    return {
      title: `${first.title} : ${coverageLabels[first.kind].toLowerCase()} ${until(first)}`,
      body: ADVICE[first.kind],
      url: `/dashboard/tickets/${first.ticketId}`,
    };
  return {
    title: `${items.length} échéances approchent`,
    body: items.slice(0, 3).map((item) => `${item.title} : ${until(item)}`).join(" · "),
    url: "/dashboard/echeances",
  };
}

export async function sendDueReminders() {
  const byUser = new Map<string, (DueRow & ReminderItem)[]>();
  for (const row of await findDueReminders())
    byUser.set(row.userId, [...(byUser.get(row.userId) ?? []), { ...row, title: reminderTitle(row) }]);

  const stats = { users: byUser.size, reminders: 0, mails: 0, pushes: 0, failures: 0 };
  for (const [userId, items] of byUser) {
    const { email, prenom, push, mail } = items[0]!;
    let delivered = false;
    let failed = false;

    if (mail && !UNDELIVERABLE.test(email)) {
      try {
        await sendReminderMail({ email, prenom }, items);
        stats.mails++;
        delivered = true;
      } catch (error) {
        failed = true;
        console.error("[rappels] mail", (error as Error).message);
      }
    }
    if (push) {
      const sent = await pushToUser(userId, pushMessage(items));
      stats.pushes += sent;
      delivered ||= sent > 0;
    }

    // Tous les canaux ont échoué : nouvel essai demain.
    if (failed && !delivered) {
      stats.failures++;
      continue;
    }
    const sql = useDb();
    const rows = items.map((item) => ({
      ticket_id: item.ticketId,
      kind: item.kind,
      deadline: item.date,
      days_before: item.daysBefore,
    }));
    await sql`insert into reminder_log ${sql(rows)} on conflict do nothing`;
    stats.reminders += items.length;
  }

  await useDb()`delete from reminder_log where deadline < current_date - 60`;
  return stats;
}
