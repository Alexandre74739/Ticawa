import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Clock,
  PencilLine,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Store,
} from "@lucide/vue";
import type { Component } from "vue";
import type { TicketFields } from "#shared/types/ticket";
import type { BadgeStatus } from "~/components/ui/Badge.vue";
import { formatDate, formatMoney, type CoverageState } from "~/utils/ticket";

export type TicketFieldKey = Exclude<keyof TicketFields, "items" | "currency" | "legalWarranty">;

export interface TicketFieldDef {
  key: TicketFieldKey;
  label: string;
  type?: "text" | "date" | "time" | "textarea";
  hint?: string;
  inputmode?: "decimal" | "numeric" | "tel";
  placeholder?: string;
  show?: (fields: TicketFields) => string | null;
  formOnly?: boolean;
}

interface TicketFieldGroup {
  title: string;
  icon: Component;
  fields: TicketFieldDef[];
}

export const ticketGroups: TicketFieldGroup[] = [
  {
    title: "Achat",
    icon: Receipt,
    fields: [
      { key: "name", label: "Nom du ticket", placeholder: "Ex. : cadeau de Léa, vélo de ville", formOnly: true },
      { key: "purchaseDate", label: "Date d'achat", type: "date", show: (f) => formatDate(f.purchaseDate) },
      { key: "purchaseTime", label: "Heure", type: "time" },
      { key: "totalAmount", label: "Total payé (€)", inputmode: "decimal", placeholder: "49,90", show: (f) => formatMoney(f.totalAmount, f.currency) },
      { key: "paymentMethod", label: "Moyen de paiement", placeholder: "Carte bancaire" },
      { key: "cardLast4", label: "4 derniers chiffres de la carte", inputmode: "numeric", placeholder: "1234", show: (f) => (f.cardLast4 ? `•••• ${f.cardLast4}` : null) },
      { key: "ticketNumber", label: "N° de ticket ou de facture" },
      { key: "registerNumber", label: "N° de caisse", inputmode: "numeric" },
    ],
  },
  {
    title: "Magasin",
    icon: Store,
    fields: [
      { key: "merchant", label: "Enseigne", placeholder: "Fnac, Darty…" },
      { key: "merchantAddress", label: "Adresse" },
      { key: "merchantPhone", label: "Téléphone", inputmode: "tel" },
      { key: "merchantSiret", label: "SIRET ou SIREN", inputmode: "numeric" },
      { key: "merchantVat", label: "N° de TVA" },
    ],
  },
  {
    title: "Échange",
    icon: RefreshCcw,
    fields: [
      { key: "returnDays", label: "Délai d'échange imprimé (jours)", inputmode: "numeric", placeholder: "30", show: (f) => (f.returnDays ? `${f.returnDays} jours` : null) },
      { key: "returnPolicy", label: "Conditions d'échange", type: "textarea" },
    ],
  },
  {
    title: "Garanties et assurance",
    icon: ShieldCheck,
    // La garantie légale n'est pas demandée : Tico la déduit des articles.
    fields: [
      { key: "warrantyMonths", label: "Garantie promise par le vendeur ou la marque (mois)", inputmode: "numeric", placeholder: "36", hint: "Seulement si le ticket, la boîte ou le vendeur l'indique. Laissez vide sinon : Tico s'occupe du reste.", show: (f) => (f.warrantyMonths ? `${f.warrantyMonths} mois` : null) },
      { key: "warrantyNote", label: "Mention de garantie lue sur le ticket", type: "textarea" },
      { key: "insuranceName", label: "Assurance prise avec l'achat", placeholder: "Ex. : assurance casse" },
      { key: "insuranceUntil", label: "Fin de l'assurance", type: "date", show: (f) => formatDate(f.insuranceUntil) },
    ],
  },
];

export const coverageStatus: Record<CoverageState, BadgeStatus> = {
  active: { label: "Actif", icon: CircleCheck, class: "bg-indigo/10 text-indigo" },
  soon: { label: "Bientôt expiré", icon: Clock, class: "bg-indigo text-paper" },
  expired: { label: "Expiré", icon: CircleX, class: "bg-ink text-paper" },
};

export const reviewStatus = (verified: boolean): BadgeStatus =>
  verified
    ? { label: "Vérifié", icon: BadgeCheck, class: "bg-indigo/10 text-indigo" }
    : { label: "À vérifier", icon: PencilLine, class: "bg-ink/10 text-ink" };

export const legalWarrantySource = {
  label: "Service-public.gouv.fr : garantie légale de conformité",
  href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F11094",
};

export const withdrawalSource = {
  label: "Service-public.gouv.fr : achat à distance",
  href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F10485",
};
