import type { LegalWarranty, TicketFields, TicketItem } from "#shared/types/ticket";

// Tico déduit seul si un achat est couvert : l'utilisateur n'a pas à connaître le droit.

const norm = (text: string | null | undefined) =>
  (text ?? "").normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();

const anyWord = (list: string[]) => new RegExp(String.raw`\b(?:${list.join("|")})\b`, "u");
const anyPrefix = (list: string[]) => new RegExp(String.raw`\b(?:${list.join("|")})`, "u");

// Enseignes du quotidien (alimentation, restauration, carburant, pharmacie) :
// un libellé inconnu y est un consommable.
const EVERYDAY_STORES = anyPrefix([
  "CARREFOUR", "LECLERC", "AUCHAN", "LIDL", "ALDI", "INTERMARCHE", "SUPER U", "HYPER U", "U EXPRESS", "SYSTEME U",
  "CASINO", "MONOPRIX", "FRANPRIX", "SPAR", "CORA", "GEANT", "NETTO", "LEADER PRICE", "GRAND FRAIS", "PICARD",
  "BIOCOOP", "NATURALIA", "LA VIE CLAIRE", "PROXI", "VIVAL", "G20", "BOULANGERIE", "BOUCHERIE", "FROMAGERIE",
  "PRIMEUR", "PHARMACIE", "PARAPHARMACIE", "TOTALENERGIES", "ESSO", "SHELL", "STATION", "AVIA", "RESTAURANT",
  "BRASSERIE", "MC ?DONALD", "BURGER", "KFC", "STARBUCKS", "PAUL", "BRIOCHE DOREE", "SUBWAY", "DOMINO", "PIZZ",
  "CAFE", "BAR", "TABAC", "RELAY", "SUSHI", "KEBAB",
]);

// Enseignes d'équipement : ce qu'on y achète est un bien durable.
const EQUIPMENT_STORES = anyPrefix([
  "FNAC", "DARTY", "BOULANGER", "IKEA", "DECATHLON", "LEROY MERLIN", "CASTORAMA", "BRICO", "APPLE", "AMAZON",
  "CDISCOUNT", "CONFORAMA", "BUT", "MAISONS DU MONDE", "ELECTRO DEPOT", "CULTURA", "GO SPORT", "INTERSPORT",
  "BACK MARKET", "LDLC", "MATERIEL.NET", "RUE DU COMMERCE", "SAMSUNG", "XIAOMI", "ORANGE", "SFR", "BOUYGUES",
  "NESPRESSO", "JOUE ?CLUB", "KING JOUET", "LA GRANDE RECRE", "ALINEA", "HABITAT", "GIFI", "ACTION", "NORAUTO",
  "FEU VERT", "MIDAS", "ZARA", "H&M", "KIABI", "CELIO", "JULES", "UNIQLO", "PRIMARK", "FOOT LOCKER", "COURIR",
]);

// Appareils reconnus avant les consommables : « GRILLE PAIN » n'est pas du
// pain, « MACHINE A CAFE » n'est pas du café.
const APPLIANCE = anyWord([
  "GRILLE.?PAIN", "MACHINE A [A-Z]+", "LAVE.?LINGE", "LAVE.?VAISSELLE", "SECHE.?LINGE", "SECHE.?CHEVEUX",
  "CAFETIERE", "EXPRESSO", "BOUILLOIRE", "YAOURTIERE", "THEIERE", "SAC A DOS", "FER A REPASSER",
  "CENTRALE VAPEUR", "BROSSE A DENTS ELEC[A-Z]*", "MICRO.?ONDES?", "BARRE DE SON", "APPAREIL PHOTO",
  "DISQUE DUR", "CLE USB", "BATTERIE EXTERNE", "SIEGE AUTO", "PLAQUE DE CUISSON",
]);

// Alimentation, hygiène, services et lignes techniques du ticket.
const CONSUMABLE = anyWord([
  "PAINS?", "BAGUETTES?", "CROISSANTS?", "VIENNOIS[A-Z]*", "LAIT", "BEURRE", "FROMAGES?", "YAOURTS?", "YOGH[A-Z]*",
  "CREMES?", "OEUFS?", "VIANDES?", "STEAKS?", "POULET", "JAMBON", "SAUCISS[A-Z]*", "POISSONS?", "SAUMON", "THON",
  "EAUX?", "JUS", "SODAS?", "COCA[A-Z]*", "BIERES?", "VINS?", "CHAMPAGNE", "CAFES?", "THE", "TISANES?", "SUCRE",
  "FARINE", "PATES", "RIZ", "BISCUITS?", "GATEAUX?", "CHOCO[A-Z]*", "BONBONS?", "CONFISERIES?", "CHIPS", "LEGUMES?",
  "FRUITS?", "POMMES?", "BANANES?", "TOMATES?", "SALADES?", "CAROTTES?", "OIGNONS?", "SAUCES?", "HUILE", "VINAIGRE",
  "SEL", "POIVRE", "EPICES?", "CONSERVES?", "SURGELES?", "GLACES?", "PIZZAS?", "SANDWICH[A-Z]*", "MENUS?",
  "BOISSONS?", "DESSERTS?", "PLATS?", "SOUPES?", "CEREALES?", "CONFITURES?", "MIEL", "PAPIER TOILETTE",
  "ESSUIE[A-Z]*", "MOUCHOIRS?", "LESSIVES?", "ADOUCISSANT", "LIQUIDE VAISSELLE", "EPONGES?", "SAVONS?", "SHAMP[A-Z]*",
  "GEL DOUCHE", "DENTIFRICE", "DEO[A-Z]*", "COTONS?", "COUCHES?", "LINGETTES?", "HYGIENIQUES?", "TAMPONS?",
  "MEDICAMENT[A-Z]*", "DOLIPRANE", "SIROP", "PANSEMENTS?", "CIGARETTES?", "TABAC", "JOURNAL", "MAGAZINES?",
  "TIMBRES?", "CARTE CADEAU", "SACHETS?", "CABAS", "SAC (?:PLASTIQUE|CAISSE|KRAFT|PAPIER|CONGELATION)", "CONSIGNE",
  "LIVRAISON", "FRAIS", "PORT", "REMISE", "PROMO", "BON D", "REDUC[A-Z]*", "FIDELITE", "CARBURANT", "GAZOLE", "SP95",
  "SP98", "DIESEL", "E10", "ESSENCE", "PARKING", "PEAGE", "TOTAL", "SOUS.?TOTAL", "TVA", "CB", "ESPECES", "RENDU",
  "MONNAIE", "PILES?", "AMPOULES?", "FILTRES?", "RECHARGES?", "CARTOUCHES?", "CAPSULES?", "DOSETTES?", "REPAS",
  "PANIER REPAS", "CROQUETTES?", "LITIERE", "TERREAU", "ENGRAIS",
  // Pas de panne possible : rien à rappeler.
  "LIVRES?", "LIVRE DE POCHE", "ROMANS?", "BD", "MANGAS?", "CAHIERS?", "STYLOS?", "CARTES? POSTALES?", "PAPETERIE",
  // Services : pas de garantie de conformité sur une prestation.
  "LOCATION", "ABONNEMENT", "FORFAIT", "PRESTATION", "ENTREES?", "BILLETS?", "COURS", "SEANCES?", "REPARATION",
  "MAIN D.?OEUVRE", "INSTALLATION", "ADHESION", "NUITEES?", "SEJOUR", "COTISATION", "ASSURANCE", "EXTENSION",
]);

// Dans une enseigne du quotidien, un article inconnu de ce prix est un objet.
const EVERYDAY_OBJECT_PRICE = 15;

// Objets durables reconnus dans le libellé d'un article.
const DURABLE = anyWord([
  "TV", "TELE[A-Z]*", "ECRANS?", "MONITEURS?", "ORDI[A-Z]*", "PC", "LAPTOP", "MACBOOK[A-Z]*", "IMAC", "PORTABLES?",
  "SMARTPHONES?", "TELEPHONES?", "IPHONE[A-Z0-9]*", "GALAXY", "PIXEL", "TABLETTES?", "IPAD[A-Z]*", "CASQUES?",
  "ECOUTEURS?", "AIRPODS", "ENCEINTES?", "CONSOLES?", "PLAYSTATION", "PS5", "XBOX", "SWITCH", "MANETTES?",
  "CAMERAS?", "OBJECTIFS?", "IMPRIMANTES?", "CLAVIERS?", "SOURIS", "MONTRES?", "SSD", "CHARGEURS?", "CABLES?", "LL",
  "LV", "FRIGO", "REFRIGERATEURS?", "CONGELATEURS?", "FOURS?", "PLAQUES?", "HOTTES?", "ASPIRATEURS?", "ROBOTS?",
  "MIXEURS?", "BLENDERS?", "FRITEUSES?", "RADIATEURS?", "CLIMATISEURS?", "VENTILATEURS?", "VELOS?", "TROTTINETTES?",
  "MEUBLES?", "CANAPES?", "FAUTEUILS?", "MATELAS", "SOMMIERS?", "CHAISES?", "TABLES?", "ARMOIRES?", "COMMODES?",
  "BUREAUX?", "ETAGERES?", "LAMPES?", "LUMINAIRES?", "PERCEUSES?", "VISSEUSES?", "PONCEUSES?", "SCIES?", "TONDEUSES?",
  "TAILLE.?HAIES?", "NETTOYEURS?", "OUTILS?", "POUSSETTES?", "LITS?", "VALISES?", "CHAUSSURES?", "BASKETS?",
  "BOTTES?", "VESTES?", "MANTEAUX?", "BLOUSONS?", "JEANS?", "PANTALONS?", "ROBES?", "PULLS?", "LUNETTES", "BIJOUX?",
  "JOUETS?", "LEGO", "POUPEES?", "GUITARES?", "PIANOS?", "RASOIRS?", "EPILATEURS?", "LISSEURS?",
]);

export function isEverydayStore(merchant: string | null) {
  const store = norm(merchant);
  return EVERYDAY_STORES.test(store) && !EQUIPMENT_STORES.test(store);
}

export function isDurable(item: Pick<TicketItem, "label" | "totalPrice">, everydayStore: boolean) {
  const text = norm(item.label);
  if (APPLIANCE.test(text)) return true;
  if (CONSUMABLE.test(text)) return false;
  if (DURABLE.test(text)) return true;
  // Libellé inconnu : un objet, sauf petit prix dans une enseigne du quotidien.
  return !everydayStore || (item.totalPrice ?? 0) >= EVERYDAY_OBJECT_PRICE;
}

// Garantie légale (2 ans) suivie dès que le ticket contient un objet durable.
function inferLegalWarranty({ merchant, items, totalAmount }: TicketFields): LegalWarranty {
  const everyday = isEverydayStore(merchant);
  if (items.length) return items.some((item) => isDurable(item, everyday)) ? "new" : "none";
  if (EQUIPMENT_STORES.test(norm(merchant))) return "new";
  return !everyday && (totalAmount ?? 0) >= 30 ? "new" : "none";
}

export const withInferredCoverage = (fields: TicketFields): TicketFields => ({
  ...fields,
  legalWarranty: inferLegalWarranty(fields),
});
