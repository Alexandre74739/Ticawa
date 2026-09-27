import type { CaseStudy, FaqItem, ProductFeature } from "#shared/types/sections";

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
    source: {
      label: "Art. L217-3 du code de la consommation",
      href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044142579",
    },
    mascot: "Happy.svg",
  },
  {
    result: "Un écran cassé pris en charge avant l'échéance",
    text: "L'assurance casse souscrite le jour de l'achat s'oublie en quelques semaines. Ticawa rappelle qu'elle couvre toujours le téléphone, jusqu'à quelle date, et prévient avant l'échéance. La déclaration à l'assureur, elle, reste la vôtre.",
    coverage: "Assurance casse et vol",
    source: {
      label: "Art. L113-2 du code des assurances",
      href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006791998",
    },
    mascot: "Perfect.svg",
  },
  {
    result: "Un échange obtenu avec un ticket illisible depuis des mois",
    text: "L'encre thermique s'efface en quelques mois, bien avant la fin de la garantie, et sans preuve d'achat la demande s'arrête là. La photo prise à la caisse, elle, reste nette : date, prix et magasin toujours lisibles au comptoir du SAV.",
    coverage: "Preuve d'achat numérisée",
    source: {
      label: "Art. 1358 du code civil",
      href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042316",
    },
    mascot: "Neutre.svg",
  },
];

export const faq: FaqItem[] = [
  {
    question: "Est-ce que Ticawa fait la réclamation à ma place ?",
    answer:
      "Non, et c'est volontaire. Ticawa vous indique quelle garantie couvre encore le produit, jusqu'à quelle date, et ressort la preuve d'achat au bon moment. Contacter le vendeur, le SAV ou l'assureur reste votre démarche : vous seul décidez quoi demander, et quand.",
  },
  {
    question: "Comment Ticawa connaît la durée de mes garanties ?",
    answer:
      "À partir de la catégorie du produit, de sa date d'achat et des documents que vous ajoutez. La garantie légale de conformité est appliquée automatiquement aux produits neufs. Les garanties commerciales et les assurances sont renseignées d'après vos justificatifs. Quand une information manque, Ticawa la signale au lieu de la deviner.",
  },
  {
    question: "La photo d'un ticket vaut-elle la preuve d'achat d'origine ?",
    answer:
      "Face à un professionnel, la preuve est libre : elle peut se faire par tout moyen. Une photo nette, datée et lisible peut donc être présentée, et beaucoup d'enseignes l'acceptent directement au comptoir. Raison de plus pour la prendre le jour de l'achat, avant que l'encre thermique ne s'efface.",
  },
  {
    question: "Où sont stockées mes factures et mes tickets ?",
    answer:
      "Vos factures, tickets et informations produits sont stockés sur des serveurs situés dans l'Union européenne. Le site lui-même est servi par un hébergeur américain (Vercel), qui ne traite que des données techniques de connexion comme l'adresse IP. Ticawa applique le RGPD : vos données ne sont ni revendues ni exploitées à des fins publicitaires. Vous gardez les droits que le règlement vous donne : consulter vos données personnelles, les exporter, supprimer définitivement votre compte, à tout moment depuis l'application.",
  },
  {
    question: "Comment installer l'application Ticawa sur iPhone ou Android ?",
    answer:
      "Ticawa s'installe directement depuis votre navigateur, en un seul clic : ni App Store, ni Google Play, l'application s'ouvre comme n'importe quelle autre, sur iPhone comme sur Android.",
  },
];
