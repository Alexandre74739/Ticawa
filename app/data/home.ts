import type { ProductFeature } from "#shared/types/sections";

export const features: ProductFeature[] = [
  {
    title: "Numérisez vos tickets de caisse en une photo",
    text: "Ticket de caisse, facture PDF, bon de garantie : chaque preuve d'achat est conservée dans l'application et reste lisible, même quand l'encre du ticket thermique s'efface.",
    bullets: [
      "Photo du ticket ou import de la facture PDF",
      "Date d'achat, prix et magasin rattachés au produit",
      "Une fiche par produit, avec tous ses justificatifs",
    ],
    mascot: "Happy.svg",
    cta: { label: "Numériser mon premier ticket", to: "/connexion" },
  },
  {
    title: "Suivez chaque garantie produit, date par date",
    text: "Pour chaque achat, Ticawa indique quelles garanties et assurances le couvrent et jusqu'à quand. Sans jargon juridique, sans calcul de tête.",
    bullets: [
      "Garantie légale de conformité de 2 ans sur les produits neufs",
      "Garantie commerciale et extension de garantie",
      "Assurances souscrites au moment de l'achat",
    ],
    mascot: "Interrogated.svg",
  },
  {
    title: "Vos preuves d'achat restent les vôtres",
    text: "Ticawa est pensé pour le RGPD dès la conception : vos factures et tickets sont hébergés en Europe, et vous gardez la main sur vos données.",
    bullets: [
      "Hébergement des données dans l'Union européenne",
      "Export de toutes vos données à tout moment",
      "Suppression définitive du compte et des données",
    ],
    mascot: "Perfect.svg",
    cta: { label: "Créer mon espace", to: "/connexion" },
  },
];
