import type { TicketFields, TicketItem } from "#shared/types/ticket";

const AMOUNT = String.raw`-?\d{1,3}(?:[. ]\d{3})+[,.]\d{2}|-?\d+[,.]\d{2}`;
const AMOUNT_SPACED = String.raw`-?\d{1,3}(?: \d{3})+[,.]\d{2}|${AMOUNT}`;

const amountRe = (spaced = false) =>
  new RegExp(`(?<![\\d,.])(${spaced ? AMOUNT_SPACED : AMOUNT})(?![\\d])`, "g");

function toAmount(raw: string) {
  const clean = raw.replace(/[\s ]/g, "");
  const decimal = clean.slice(-3).replace(",", ".");
  const whole = clean.slice(0, -3).replace(/[.,]/g, "");
  const value = Number(whole + decimal);
  return Number.isFinite(value) ? value : null;
}

function amounts(line: string, spaced = false) {
  return [...line.matchAll(amountRe(spaced))]
    .map((m) => toAmount(m[1]!))
    .filter((v): v is number => v !== null);
}

function lastAmount(line: string, spaced = false) {
  return amounts(line, spaced).at(-1) ?? null;
}

function normalize(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[’`]/g, "'")
    .replace(/(?<=\d)[Oo](?=[\d,.])|(?<=\d[,.]\d?)[Oo](?!\p{L})/gu, "0")
    .replace(/(?<=\d[,.]\d?)[lI|](?!\p{L})|(?<=\d)[lI|](?=[,.]\d)/gu, "1")
    .replace(/(?<![\d.,])(\d+)\.(\d{2})(?![\d.,])/g, "$1,$2")
    .replace(/[ \t ]+/g, " ");
}

function toLines(text: string) {
  return normalize(text)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 1);
}

const hasLetters = (line: string, min = 3) =>
  (line.match(/\p{L}/gu)?.length ?? 0) >= min;

const SMALL_WORDS = new Set(["DE", "DU", "LA", "LE", "LES", "DES", "EN", "ET", "AU", "AUX", "SUR"]);

function tidy(value: string) {
  const trimmed = value.replace(/^[\s*#=_.:-]+|[\s*#=_.:-]+$/g, "");
  if (trimmed !== trimmed.toUpperCase()) return trimmed;
  return trimmed.replace(/[^\s'(-]+/gu, (word) =>
    SMALL_WORDS.has(word)
      ? word.toLowerCase()
      : /\d/.test(word) || word.length <= 2
        ? word
        : word[0] + word.slice(1).toLowerCase(),
  );
}

function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2) n = n * 2 > 9 ? n * 2 - 9 : n * 2;
    sum += n;
  }
  return sum % 10 === 0;
}

const KNOWN = [
  "Fnac", "Darty", "Boulanger", "Leroy Merlin", "Castorama", "Brico Dépôt",
  "Bricomarché", "Mr Bricolage", "Decathlon", "Intersport", "Go Sport",
  "Carrefour Market", "Carrefour City", "Carrefour", "Auchan", "E.Leclerc",
  "Leclerc", "Intermarché", "Super U", "Hyper U", "Système U", "Lidl", "Aldi",
  "Monoprix", "Franprix", "Casino", "Picard", "Ikea", "Conforama", "But",
  "Maisons du Monde", "Apple", "Samsung", "Amazon", "Cdiscount", "LDLC",
  "Materiel.net", "Rue du Commerce", "Cultura", "Micromania", "Action",
  "Gifi", "Kiabi", "Zara", "H&M", "Uniqlo", "Sephora", "Nocibé", "Norauto",
  "Feu Vert", "Orange", "SFR", "Bouygues Telecom", "Free", "Jardiland",
  "Truffaut", "Nature & Découvertes", "La Poste", "Galeries Lafayette",
  "Printemps", "Bershka", "Celio", "Jules", "Electro Dépôt",
];

const ACCENTS: Record<string, string> = { é: "[eéèê]", è: "[eéèê]", ô: "[oô]" };

function pattern(name: string) {
  const body = name
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/[éèô]/g, (c) => ACCENTS[c]!)
    .replace(/\s*&\s*/g, "\\s*&\\s*")
    .replace(/\s+/g, "\\s*");
  return new RegExp(`(?:^|[^\\p{L}])${body}(?![\\p{L}])`, "iu");
}

const KNOWN_RE = KNOWN.map((name) => ({ name, re: pattern(name) }));

const NOT_A_NAME =
  /bienvenue|merci|ticket|facture|caisse|siret|siren|tva|t[ée]l|www\.|@|\d{5}|horaires|ouvert|client|date|re[çc]u|duplicata/i;

function findMerchant(lines: string[]) {
  const head = lines.slice(0, 8).join("\n");
  const known = KNOWN_RE.map(({ name, re }) => ({ name, at: head.search(re) }))
    .filter(({ at }) => at >= 0)
    .sort((a, b) => a.at - b.at || b.name.length - a.name.length)[0];
  if (known) return known.name;

  const candidate = lines
    .slice(0, 6)
    .find((line) => hasLetters(line, 3) && !NOT_A_NAME.test(line) && line.length <= 40);
  return candidate ? tidy(candidate) : null;
}

const STREET =
  /^\d{1,4}\s*(bis|ter)?\b|\b(rue|avenue|av\.?|bd|boulevard|place|pl\.|chemin|route|rte|all[ée]e|quai|cours|impasse|centre commercial|c\.?\s?cial|zac|za|zi|parc|lieu[- ]dit)\b/i;

function findAddress(lines: string[]) {
  const head = lines.slice(0, 14);
  const index = head.findIndex((line) =>
    /\b\d{5}\s+\p{L}[\p{L}' -]{2,}/u.test(line),
  );
  if (index < 0) return null;
  const city = head[index]!.match(/\b\d{5}\s+\p{L}[\p{L}' -]{2,}/u)![0].trim();
  const before = head[index - 1];
  const street = before && STREET.test(before) ? tidy(before) : null;
  return [street, tidy(city)].filter(Boolean).join(", ");
}

function findSiret(text: string) {
  for (const m of text.matchAll(/SIRE[TN][^\d\n]{0,12}([\d ]{9,20})/gi)) {
    const digits = m[1]!.replace(/\s/g, "");
    const siret = digits.slice(0, 14);
    if (siret.length === 14 && luhn(siret)) return siret;
    if (digits.length >= 9 && luhn(digits.slice(0, 9))) return digits.slice(0, 9);
  }
  return null;
}

function findVat(text: string) {
  const m = text.match(/\bFR ?([0-9A-Z]{2}) ?(\d{3}) ?(\d{3}) ?(\d{3})\b/);
  return m ? `FR${m.slice(1).join("")}` : null;
}

function findPhone(lines: string[]) {
  for (const line of lines.slice(0, 16)) {
    const m = line.match(/(?:\+33 ?|\b0)[1-9](?:[ .-]?\d{2}){4}\b/);
    if (m && !/siret|siren|tva/i.test(line)) return m[0].replace(/[ .-]/g, " ");
  }
  return null;
}

const MONTHS = ["janv", "f[eé]v", "mars", "avr", "mai", "juin", "juil", "ao[uû]", "sept", "oct", "nov", "d[eé]c"];
const MONTH_RE = new RegExp(`\\b(\\d{1,2})(?:er)? (${MONTHS.join("|")})[\\p{L}.]* (\\d{4})\\b`, "giu");

const pad = (n: number) => String(n).padStart(2, "0");

function toIso(year: number, month: number, day: number) {
  if (year < 100) year += 2000;
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    date.getUTCMonth() === month - 1 &&
    year >= 2000 &&
    date.getTime() <= Date.now() + 86_400_000;
  return valid ? `${year}-${pad(month)}-${pad(day)}` : null;
}

function datesIn(line: string) {
  const found: string[] = [];
  for (const m of line.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})\b/g))
    found.push(toIso(+m[3]!, +m[2]!, +m[1]!) ?? "");
  for (const m of line.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g))
    found.push(toIso(+m[1]!, +m[2]!, +m[3]!) ?? "");
  for (const m of line.matchAll(MONTH_RE)) {
    const month = MONTHS.findIndex((re) => new RegExp(`^${re}`, "iu").test(m[2]!));
    found.push(toIso(+m[3]!, month + 1, +m[1]!) ?? "");
  }
  return found.filter(Boolean);
}

const TIME_RE = /\b([01]?\d|2[0-3]) ?[:hH] ?([0-5]\d)(?:[:'][0-5]\d)?\b/;

function dateScore(line: string) {
  let score = 0;
  if (TIME_RE.test(line)) score += 3;
  if (/date|\ble\b|factur|command|achat|vente/i.test(line)) score += 2;
  if (/valable|expir|jusqu|avant le|[ée]ch[ée]ance|livr|naissance|garanti/i.test(line)) score -= 6;
  return score;
}

function findDateTime(lines: string[]) {
  let best: { date: string; line: string; score: number } | null = null;
  lines.forEach((line, i) => {
    for (const date of datesIn(line)) {
      const score = dateScore(line) - i * 0.01;
      if (!best || score > best.score) best = { date, line, score };
    }
  });
  const found = best as { date: string; line: string } | null;
  const timeLine =
    (found && TIME_RE.test(found.line) ? found.line : null) ??
    lines.find((l) => TIME_RE.test(l) && !/ouvert|horaire|lundi|du \d/i.test(l));
  const time = timeLine?.match(TIME_RE);
  return {
    date: found?.date ?? null,
    time: time ? `${pad(+time[1]!)}:${time[2]}` : null,
  };
}

const TOTAL_KEYS: [RegExp, number][] = [
  [/total ?ttc|net [àa] payer|montant ?ttc/i, 10],
  [/montant (total|[àa] payer|d[uû])|total [àa] payer|\b[àa] payer\b/i, 9],
  [/total ?(eur|€)/i, 8],
  [/^total\b/i, 7],
  [/\btotal\b/i, 5],
];
const NOT_TOTAL =
  /sous[- ]?total|total ?(ht|tva|remise|[ée]conomi|articles?|points|qt[eé]|fid[ée]lit)|nb ?art|\btva\b|rendu|avantage/i;

function findTotal(lines: string[]) {
  let best: { value: number; score: number } | null = null;
  lines.forEach((line, i) => {
    if (NOT_TOTAL.test(line)) return;
    const key = TOTAL_KEYS.find(([re]) => re.test(line));
    if (!key) return;
    const value = lastAmount(line, true) ?? lastAmount(lines[i + 1] ?? "", true);
    if (value === null || value <= 0) return;
    if (!best || key[1] > best.score) best = { value, score: key[1] };
  });
  if (best) return (best as { value: number }).value;

  const paid = lines.find((l) => /\b(cb|carte|montant)\b/i.test(l) && amounts(l).length);
  return paid ? lastAmount(paid) : null;
}

const PAYMENTS: [RegExp, string][] = [
  [/sans ?contact|contactless/i, "Carte bancaire sans contact"],
  [/apple ?pay|google ?pay|samsung ?pay|paylib/i, "Paiement mobile"],
  [/carte ?cadeau|bon d'achat|\bavoir\b/i, "Carte cadeau ou avoir"],
  [/\bcb\b|carte ?banc|carte ?bleue|\bvisa\b|master ?card|maestro|amex|american express/i, "Carte bancaire"],
  [/esp[eè]ces?|\bcash\b/i, "Espèces"],
  [/ch[eè]que(?! ?cadeau)|\bchq\b/i, "Chèque"],
  [/paypal/i, "PayPal"],
  [/virement/i, "Virement"],
];

function findPayment(text: string) {
  const method = PAYMENTS.find(([re]) => re.test(text))?.[1] ?? null;
  const card =
    text.match(/(?:[X*•#] ?){4,}(\d{4})\b/i) ??
    text.match(/(?:terminant|finissant) par (\d{4})\b/i);
  return { method, cardLast4: card?.[1] ?? null };
}

const NUMBER_RES = [
  /num[ée]ro de (?:la )?(?:facture|commande)\s*:?\s*([A-Z0-9][A-Z0-9/_-]{2,})/i,
  /(?:facture|invoice)\s*(?:n[°o]|#|num[ée]ro)\s*[:.]?\s*([A-Z0-9][A-Z0-9/_-]{2,})/i,
  /(?:ticket|tkt)\s*(?:n[°o]|#)?\s*[:.]?\s*([A-Z0-9][A-Z0-9/_-]{2,})/i,
  /(?:commande|order)\s*(?:n[°o]|#)\s*[:.]?\s*([A-Z0-9][A-Z0-9/_-]{2,})/i,
  /\btrans(?:action)?\s*(?:n[°o]|#)?\s*[:.]?\s*(\d{3,})/i,
];

function findTicketNumber(text: string) {
  for (const re of NUMBER_RES) {
    const value = text.match(re)?.[1];
    if (value && /\d/.test(value)) return value;
  }
  return null;
}

function findRegister(text: string) {
  return text.match(/\bcaisse\s*(?:n[°o])?\s*[:.]?\s*(\d{1,4})\b/i)?.[1] ?? null;
}

const MAX_ITEMS = 60;

const NOT_ITEM =
  /total|\btva\b|\bht\b|\bttc\b|taux|\bbase\b|rendu|monnaie|\bcb\b|carte|esp[eè]ces|ch[eè]que|payer|pay[ée]|montant|r[eè]glement|avoir|fid[ée]lit|points?\b|remise|r[ée]duc|promo|coupon|[ée]conomi|acompte|frais de port|livraison|solde|cagnotte|contactless|sans contact|d[ée]bit|\bnet\b/i;

const QTY_RE = /^(\d+(?:,\d+)?) ?[xX*] ?(\d+,\d{2})(?: ?(?:€|eur))?(?: (\d+,\d{2}))?/i;
const TRAILING_RE = /^(.*?)\s+(-?\d+,\d{2})\s*(?:€|eur|e)?\s*(?:[A-D]|\d{1,2}|\*)?\s*$/i;
const REFERENCE_RE = /\b(\d{13}|\d{8})\b|\br[ée]f\.?\s*:?\s*([A-Z0-9-]{4,})/i;

function cleanLabel(raw: string) {
  const reference = raw.match(REFERENCE_RE);
  const label = raw
    .replace(REFERENCE_RE, "")
    .replace(/\s+\d+(?:,\d+)?\s*$/, "")
    .trim();
  return {
    label: tidy(label),
    reference: reference ? (reference[1] ?? reference[2] ?? null) : null,
  };
}

function withQuantity(label: string, qty: string, unit: string, total: number | null): TicketItem {
  const quantity = Number(qty.replace(",", ".")) || 1;
  const unitPrice = toAmount(unit);
  return {
    ...cleanLabel(label),
    quantity,
    unitPrice,
    totalPrice: total ?? (unitPrice === null ? null : Math.round(unitPrice * quantity * 100) / 100),
  };
}

function findItems(lines: string[]) {
  const end = lines.findIndex((l) => /^(sous[- ]?)?total\b|net [àa] payer|montant ttc/i.test(l));
  const body = lines.slice(0, end < 0 ? lines.length : end);
  const items: TicketItem[] = [];
  let pending: string | null = null;

  for (const line of body) {
    if (items.length >= MAX_ITEMS) break;
    const qty = line.match(QTY_RE);
    if (qty && pending) {
      items.push(withQuantity(pending, qty[1]!, qty[2]!, qty[3] ? toAmount(qty[3]) : null));
      pending = null;
      continue;
    }

    const trailing = line.match(TRAILING_RE);
    if (!trailing || NOT_ITEM.test(line) || !hasLetters(trailing[1]!, 2)) {
      pending = hasLetters(line, 3) && !amounts(line).length && !NOT_ITEM.test(line) ? line : null;
      continue;
    }
    pending = null;
    const total = toAmount(trailing[2]!);
    const inner = trailing[1]!.match(/^(.*?)\s+(\d+(?:,\d+)?)\s*[xX*]?\s*(\d+,\d{2})\s*(?:€|eur)?$/i);
    if (inner && hasLetters(inner[1]!, 2))
      items.push(withQuantity(inner[1]!, inner[2]!, inner[3]!, total));
    else items.push({ ...cleanLabel(trailing[1]!), quantity: 1, unitPrice: total, totalPrice: total });
  }
  return items.filter((item) => item.label.length >= 2);
}

const RETURN_WORDS = String.raw`[ée]chang\p{L}*|rembours\p{L}*|retour\p{L}*|repris\p{L}*|changer d'avis`;
const RETURN_RES = [
  new RegExp(`(?:${RETURN_WORDS})[^\\n]{0,80}?\\b(\\d{1,3}) ?(?:jours|jrs?|j)\\b`, "iu"),
  new RegExp(`\\b(\\d{1,3}) ?(?:jours|jrs?|j)\\b[^\\n]{0,60}?(?:${RETURN_WORDS})`, "iu"),
];

const upper = (line: string) => line === line.toUpperCase();

function sentence(lines: string[], index: number) {
  const parts = [lines[index]!];
  for (let i = index + 1; i < lines.length && parts.length < 3; i++) {
    const next = lines[i]!;
    const last = parts.at(-1)!;
    if (/[.!]$/.test(last) || /\d+,\d{2}|merci|bonne journ|[àa] bient[oô]t/i.test(next) || upper(next) !== upper(last)) break;
    parts.push(next);
  }
  return parts.join(" ").slice(0, 300);
}

const MENTION_RE = new RegExp(`${RETURN_WORDS}|\\b\\d{1,3} ?jours\\b`, "iu");

function findReturnPolicy(lines: string[]) {
  for (let i = 0; i < lines.length; i++) {
    const window = `${lines[i]} ${lines[i + 1] ?? ""}`;
    for (const re of RETURN_RES) {
      const days = Number(window.match(re)?.[1]);
      if (!(days >= 1 && days <= 365)) continue;
      const start = MENTION_RE.test(lines[i]!) ? i : i + 1;
      return { days, text: sentence(lines, start) };
    }
  }
  return { days: null, text: null };
}

function findWarranty(lines: string[]) {
  const index = lines.findIndex(
    (line) =>
      /garanti\p{L}*[^\n]{0,60}?\b\d{1,2} ?ans?\b|\b\d{1,2} ?ans? de garantie|extension de garantie|garantie (constructeur|fabricant|commerciale)/iu.test(line),
  );
  return index < 0 ? null : sentence(lines, index);
}

export function parseReceipt(raw: string): TicketFields {
  const lines = toLines(raw);
  const text = normalize(raw);
  const { date, time } = findDateTime(lines);
  const payment = findPayment(text);
  const policy = findReturnPolicy(lines);

  return {
    name: null,
    merchant: findMerchant(lines),
    merchantAddress: findAddress(lines),
    merchantSiret: findSiret(text),
    merchantVat: findVat(text),
    merchantPhone: findPhone(lines),
    purchaseDate: date,
    purchaseTime: time,
    ticketNumber: findTicketNumber(text),
    registerNumber: findRegister(text),
    totalAmount: findTotal(lines),
    currency: "EUR",
    paymentMethod: payment.method,
    cardLast4: payment.cardLast4,
    returnDays: policy.days,
    returnPolicy: policy.text,
    warrantyNote: findWarranty(lines),
    // Jamais déduits du ticket : c'est l'utilisateur qui les confirme.
    legalWarranty: null,
    warrantyMonths: null,
    insuranceName: null,
    insuranceUntil: null,
    items: findItems(lines.slice(3)),
  };
}
