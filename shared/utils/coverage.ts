import type { CoverageKind, TicketSummary } from "#shared/types/ticket";

export const coverageLabels: Record<CoverageKind, string> = {
  return: "Échange ou remboursement",
  legal: "Garantie pannes et défauts",
  commercial: "Garantie du vendeur ou de la marque",
  insurance: "Assurance",
};

type CoverageSource = Pick<
  TicketSummary,
  "purchaseDate" | "returnDays" | "legalWarranty" | "warrantyMonths" | "insuranceUntil"
>;

// Même calcul que coverageRows() en SQL : le 31 janvier + 1 mois donne fin février.
function add(iso: string, { days = 0, months = 0 }) {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  const lastDay = new Date(Date.UTC(y, m + months, 0)).getUTCDate();
  const day = months ? Math.min(d, lastDay) : d + days;
  return new Date(Date.UTC(y, m - 1 + months, day)).toISOString().slice(0, 10);
}

export function coverageEnds(t: CoverageSource) {
  const bought = t.purchaseDate;
  const ends: { kind: CoverageKind; date: string }[] = [];
  if (bought && t.returnDays) ends.push({ kind: "return", date: add(bought, { days: t.returnDays }) });
  // Garantie légale : 2 ans quand le vendeur est un professionnel (art. L217-3).
  if (bought && t.legalWarranty === "new") ends.push({ kind: "legal", date: add(bought, { months: 24 }) });
  if (bought && t.warrantyMonths) ends.push({ kind: "commercial", date: add(bought, { months: t.warrantyMonths }) });
  if (t.insuranceUntil) ends.push({ kind: "insurance", date: t.insuranceUntil });
  return ends;
}
