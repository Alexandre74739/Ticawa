import {
  Bell,
  Camera,
  CircleCheck,
  CircleDashed,
  CircleMinus,
  CircleX,
  HardDrive,
} from "@lucide/vue";
import type { Component } from "vue";
import type {
  PermissionKey,
  PermissionState,
} from "~/composables/usePermissions";

type Steps = { ios: string[]; android: string[] };

export interface PermissionInfo {
  key: PermissionKey;
  icon: Component;
  title: string;
  why: string;
  // `install` : iPhone sans l'app installée.
  hints: Partial<Record<PermissionState | "install", string>>;
  revoke: {
    title: string;
    intro: string;
    // `app` : Ticawa installé sur l'écran d'accueil · `browser` : ouvert dans le navigateur.
    app: Steps;
    browser: Steps;
  };
}

export const permissionStatus: Record<
  PermissionState,
  { label: string; icon: Component; class: string }
> = {
  granted: { label: "Autorisé", icon: CircleCheck, class: "bg-success/10 text-success" },
  prompt: { label: "Pas encore demandé", icon: CircleDashed, class: "bg-indigo/10 text-indigo" },
  denied: { label: "Bloqué", icon: CircleX, class: "bg-danger/10 text-danger" },
  unsupported: { label: "Indisponible", icon: CircleMinus, class: "bg-ink/10 text-ink/70" },
};

const appInfo = "Appuyez longuement sur l’icône Ticawa, puis sur Infos sur l’appli.";
const chromeSites = "Dans Chrome, ouvrez le menu ⋮, puis Paramètres, puis Paramètres des sites.";

const iosNotifications = [
  "Ouvrez Réglages, puis Notifications.",
  "Choisissez Ticawa.",
  "Désactivez Autoriser les notifications.",
];
const iosCamera = [
  "Ouvrez Réglages, puis Safari.",
  "Touchez Appareil photo.",
  "Choisissez Refuser.",
];

export const permissions: PermissionInfo[] = [
  {
    key: "notifications",
    icon: Bell,
    title: "Notifications",
    why: "Pour recevoir les alertes sur ce téléphone, même quand l’app est fermée.",
    hints: {
      denied: "Pour les réactiver, ouvrez les réglages de votre téléphone, puis Notifications, puis Ticawa.",
      unsupported: "Ce navigateur ne gère pas les notifications.",
      install: "Sur iPhone, les notifications ne fonctionnent qu’une fois Ticawa installé sur l’écran d’accueil.",
    },
    revoke: {
      title: "aux notifications",
      intro: "Pour que le téléphone lui-même bloque les notifications :",
      app: {
        ios: iosNotifications,
        android: [appInfo, "Touchez Notifications.", "Désactivez-les."],
      },
      browser: {
        ios: iosNotifications,
        android: [chromeSites, "Touchez Notifications, puis Ticawa.", "Choisissez Bloquer."],
      },
    },
  },
  {
    key: "camera",
    icon: Camera,
    title: "Appareil photo",
    why: "Pour photographier vos tickets et factures. Rien n’est filmé en dehors de ce moment.",
    hints: {
      denied: "Pour la réactiver, ouvrez les réglages de votre téléphone, puis les autorisations de Ticawa (ou de votre navigateur).",
      unsupported: "Cet appareil ne donne pas accès à son appareil photo.",
    },
    revoke: {
      title: "à l’appareil photo",
      intro: "Ticawa n’utilise l’appareil photo que pendant une prise de vue. Pour le lui interdire complètement :",
      app: {
        ios: iosCamera,
        android: [appInfo, "Touchez Autorisations, puis Appareil photo.", "Choisissez Ne pas autoriser."],
      },
      browser: {
        ios: iosCamera,
        android: [chromeSites, "Touchez Appareil photo, puis Ticawa.", "Choisissez Bloquer."],
      },
    },
  },
  {
    key: "storage",
    icon: HardDrive,
    title: "Stockage durable",
    why: "Pour que votre téléphone ne vide pas les données de Ticawa quand il manque de place.",
    hints: {
      denied: "Votre téléphone décide seul. Installer Ticawa sur l’écran d’accueil l’aide souvent à accepter.",
      unsupported: "Ce navigateur ne propose pas de stockage durable.",
    },
    revoke: {
      title: "au stockage durable",
      intro: "Le stockage durable ne se retire qu’en effaçant les données de Ticawa sur ce téléphone. Vous serez déconnecté, mais votre compte reste intact.",
      app: {
        ios: [
          "Appuyez longuement sur l’icône Ticawa.",
          "Touchez Supprimer l’app, puis confirmez.",
          "Réinstallez-la depuis Safari si vous le souhaitez.",
        ],
        android: [appInfo, "Touchez Stockage et cache.", "Touchez Vider le stockage."],
      },
      browser: {
        ios: [
          "Ouvrez Réglages, puis Safari, puis Avancé.",
          "Touchez Données de sites web.",
          "Supprimez la ligne de Ticawa.",
        ],
        android: [
          chromeSites,
          "Touchez Toutes les données des sites, puis Ticawa.",
          "Touchez Effacer et réinitialiser.",
        ],
      },
    },
  },
];
