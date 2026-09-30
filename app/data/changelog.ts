export interface ChangelogEntry {
  id: string;
  date: string;
  title: string;
  items: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    id: "2026-09-rappels",
    date: "2026-09-30",
    title: "Tico vous prévient",
    items: [
      "Les rappels d’expiration partent maintenant, par e-mail et sur votre téléphone.",
      "Tico repère seul ce qui protège vos achats : garantie contre les pannes, garantie de la marque, assurance.",
      "Chaque rappel vous dit simplement quoi faire, et seulement quand ça en vaut la peine.",
      "Le calendrier des échéances affiche toutes les dates de fin, pas seulement l’échange.",
    ],
  },
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
