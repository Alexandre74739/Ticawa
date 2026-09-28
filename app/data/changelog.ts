export interface ChangelogEntry {
  id: string;
  date: string;
  title: string;
  items: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    id: "2026-09-parametres",
    date: "2026-09-28",
    title: "Une page Paramètres",
    items: [
      "Choisissez si Tico vous prévient avant qu’une garantie expire.",
      "Recevez les alertes sur votre téléphone, par e-mail, ou les deux.",
      "Vérifiez en un coup d’œil les autorisations de votre appareil.",
    ],
  },
];
