import type { CaseStudy, ProductFeature } from "#shared/types/sections";

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

export const cases: CaseStudy[] = [
  {
    result: "Un lave-linge réparé sans payer, 18 mois après l'achat",
    text: "La panne tombe bien après la garantie commerciale du magasin. La garantie légale de conformité, elle, couvre deux ans : Ticawa affiche la date de fin et ressort la facture à présenter au SAV.",
    coverage: "Garantie légale de conformité",
    detail: "2 ans sur un produit neuf",
    mascot: "Happy.svg",
  },
  {
    result: "Un écran cassé pris en charge avant l'échéance",
    text: "L'assurance casse souscrite le jour de l'achat s'oublie en quelques semaines. Ticawa la rattache au téléphone et prévient avant la fin, assez tôt pour monter le dossier.",
    coverage: "Assurance casse et vol",
    detail: "Durée fixée au contrat",
    mascot: "Perfect.svg",
  },
  {
    result: "Un échange obtenu avec un ticket illisible depuis des mois",
    text: "L'encre thermique s'efface en quelques mois, bien avant la fin de la garantie, et sans preuve d'achat la demande s'arrête là. La photo prise à la caisse, elle, reste nette : date, prix et magasin toujours lisibles au comptoir du SAV.",
    coverage: "Preuve d'achat numérisée",
    detail: "Ticket, facture PDF ou e-mail de commande",
    mascot: "Neutre.svg",
  },
];
