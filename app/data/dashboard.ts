import {
  CalendarClock,
  ChartColumn,
  LayoutDashboard,
  ReceiptText,
  ScanLine,
  UsersRound,
} from "@lucide/vue";
import type { Component } from "vue";
import type { SourceLink } from "#shared/types/sections";
import { cases } from "./home";
import { withdrawalSource } from "./ticketFields";

export interface DashboardLink {
  label: string;
  to: string;
  icon: Component;
  installedOnly?: boolean;
  exact?: boolean;
}

export const dashboardLinks: DashboardLink[] = [
  {
    label: "Vue d'ensemble",
    to: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "Mes tickets", to: "/dashboard/tickets", icon: ReceiptText },
  { label: "Échéances", to: "/dashboard/echeances", icon: CalendarClock },
  {
    label: "Scanner",
    to: "/dashboard/scanner",
    icon: ScanLine,
    installedOnly: true,
  },
];

export const adminLinks: DashboardLink[] = [
  { label: "Utilisateurs", to: "/dashboard/utilisateurs", icon: UsersRound },
  { label: "Statistiques", to: "/dashboard/statistiques", icon: ChartColumn },
];

export interface RightTip {
  text: string;
  source: SourceLink;
}

export const rightTips: RightTip[] = [
  {
    text: "Acheté en ligne ? Vous avez 14 jours pour changer d'avis, sans avoir à vous justifier.",
    source: withdrawalSource,
  },
  {
    text: "Un produit neuf tombe en panne ? La garantie légale de conformité le couvre pendant 2 ans, même après la garantie du magasin.",
    source: cases[0]!.source,
  },
  {
    text: "Une assurance casse se déclare dans le délai prévu au contrat, jamais moins de 5 jours ouvrés : gardez la facture à portée de main.",
    source: cases[1]!.source,
  },
  {
    text: "Le ticket de caisse s'efface avec le temps, pas sa photo : une preuve d'achat lisible vaut de l'or au comptoir du SAV.",
    source: cases[2]!.source,
  },
];
