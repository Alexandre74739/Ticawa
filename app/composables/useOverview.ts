import type { Deadline, Overview, TicketSummary } from "#shared/types/ticket";
import { rightTips } from "~/data/dashboard";

export interface OverviewAction {
  label: string;
  to: string;
  only?: "installed" | "browser";
}

export interface OverviewRow {
  id: string;
  key?: string;
  title: string;
  meta: string;
  value: string;
  mascot?: string;
}

const ticketName = (ticket: TicketSummary) =>
  ticket.name ?? ticket.merchant ?? "Achat sans nom";

const addTicket: OverviewAction[] = [
  { label: "Ajouter un ticket", to: "/dashboard/scanner", only: "installed" },
  { label: "Voir mes échéances", to: "/dashboard/echeances", only: "browser" },
];

function hero({ ongoing, tracked, incomplete }: Overview) {
  const percent = ongoing ? Math.floor((tracked / ongoing) * 100) : 100;
  if (!incomplete) {
    return {
      percent,
      title: "Tico veille sur tous vos tickets",
      text: "Dates d'achat, délais d'échange et garanties sont connus : vous serez prévenu avant chaque date limite.",
      actions: addTicket,
    };
  }
  return {
    percent,
    title: "Aide Tico à veiller sur tes tickets",
    text: "Ajoutez la date d'achat ou validez ce que Tico a lu : il calcule vos garanties et vous prévient avant chaque date limite.",
    actions: [{ label: "Compléter un ticket", to: `/dashboard/tickets/${incomplete.id}` }],
  };
}

function deadlineRow({ ticket, kind, date }: Deadline): OverviewRow {
  const { iso, daysLeft } = countdown(date);
  return {
    id: ticket.id,
    key: `${ticket.id}-${kind}`,
    title: ticketName(ticket),
    meta: `${coverageLabels[kind]} · ${formatDate(iso, "short")}`,
    value: daysLeft ? `dans ${daysLeft} j` : "aujourd'hui",
    mascot: daysLeft < 15 ? "Surprised" : "Neutre",
  };
}

function recentRow(ticket: TicketSummary): OverviewRow {
  const date = formatDate(ticket.purchaseDate, "short") ?? "Date à compléter";
  return {
    id: ticket.id,
    title: ticketName(ticket),
    meta: ticket.name && ticket.merchant ? `${ticket.merchant} · ${date}` : date,
    value: formatMoney(ticket.totalAmount, ticket.currency) ?? "—",
  };
}

export async function useOverview() {
  const tip = useState("overview-tip", () =>
    Math.floor(Math.random() * rightTips.length),
  );
  const { data, error } = await useFetch<Overview>("/api/overview");

  const summary = computed(() => data.value && hero(data.value));


  const lists = computed(() => {
    if (!data.value) return [];
    return [
      {
        title: "Échéances",
        rows: data.value.deadlines.map(deadlineRow),
        empty: "Aucune échéance en cours. Tico vous préviendra dès qu'un achat approche de sa date limite.",
        actions: [{ label: "Voir le calendrier", to: "/dashboard/echeances" }],
      },
      {
        title: "Derniers tickets",
        rows: data.value.recent.map(recentRow),
        empty: "",
        actions: [{ label: "Tous mes tickets", to: "/dashboard/tickets" }],
      },
    ];
  });

  return { data, error, summary, tip: computed(() => rightTips[tip.value]!), lists, addTicket };
}
