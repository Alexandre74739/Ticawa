export type CoverageState = "active" | "soon" | "expired";

const DAY = 86_400_000;

export const isoDate = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("-");

export const localDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
};

export function formatDate(
  iso: string | null,
  style: "long" | "short" = "long",
) {
  if (!iso) return null;
  return localDate(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

export function formatMoney(value: number | null, currency = "EUR") {
  if (value === null) return null;
  return value.toLocaleString("fr-FR", { style: "currency", currency });
}

// Jours restants jusqu'à une date de fin (ISO), et l'état à afficher.
export function countdown(iso: string, soonDays = 7) {
  const deadline = localDate(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((deadline.getTime() - today.getTime()) / DAY);
  const state: CoverageState =
    daysLeft < 0 ? "expired" : daysLeft <= soonDays ? "soon" : "active";

  return {
    iso: isoDate(deadline),
    deadline: deadline.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    daysLeft,
    state,
  };
}

// Toutes les couvertures connues d'un ticket, triées par date de fin.
export const coverages = (ticket: Parameters<typeof coverageEnds>[0]) =>
  coverageEnds(ticket)
    .map(({ kind, date }) => ({
      kind,
      label: coverageLabels[kind],
      ...countdown(date, kind === "return" ? 7 : 30),
    }))
    .sort((a, b) => a.iso.localeCompare(b.iso));
