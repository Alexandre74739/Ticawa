import { FilePen, Trash2, UserPen, UserX } from "@lucide/vue";
import type { Component } from "vue";
import type { AdminAction, AdminLogKind } from "#shared/types/adminLog";
import { formatDate, formatMoney } from "~/utils/ticket";
import { ticketGroups } from "./ticketFields";

export const logActions: Record<AdminAction, { label: string; icon: Component }> = {
  "user.update": { label: "a modifié le compte", icon: UserPen },
  "user.delete": { label: "a supprimé le compte", icon: UserX },
  "ticket.update": { label: "a modifié un ticket de", icon: FilePen },
  "ticket.delete": { label: "a supprimé un ticket de", icon: Trash2 },
};

export const logFilters: { label: string; value: AdminLogKind | undefined }[] = [
  { label: "Tout", value: undefined },
  { label: "Modifications", value: "update" },
  { label: "Suppressions", value: "delete" },
];

export const fieldLabels: Record<string, string> = {
  prenom: "Prénom",
  nom: "Nom",
  email: "Email",
  emailVerified: "Email vérifié",
  logout: "Déconnexion de tous ses appareils",
  items: "Articles",
  currency: "Devise",
  ...Object.fromEntries(
    ticketGroups.flatMap((group) => group.fields.map((field) => [field.key, field.label])),
  ),
};

export function showValue(field: string, value: string | null) {
  if (value === null) return "vide";
  if (field === "purchaseDate") return formatDate(value) ?? value;
  if (field === "totalAmount") return formatMoney(Number(value)) ?? value;
  return value;
}
