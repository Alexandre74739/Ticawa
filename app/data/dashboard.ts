import {
  CalendarClock,
  ChartColumn,
  LayoutDashboard,
  ReceiptText,
  ScanLine,
  UsersRound,
} from "@lucide/vue";
import type { Component } from "vue";

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
