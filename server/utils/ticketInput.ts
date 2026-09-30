import type { TicketFields, TicketItem } from "#shared/types/ticket";

const MAX_ITEMS = 200;

function invalid(label: string): never {
  throw createError({ statusCode: 400, message: `${label} invalide.` });
}

function text(value: unknown, label: string, max = 200) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") invalid(label);
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length > max) invalid(label);
  return trimmed || null;
}

function matching(value: unknown, label: string, re: RegExp) {
  const result = text(value, label, 40);
  if (result && !re.test(result)) invalid(label);
  return result;
}

function amount(value: unknown, label: string, min = -1e7) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value)) invalid(label);
  if (value < min || value >= 1e7) invalid(label);
  return Math.round(value * 100) / 100;
}

function date(value: unknown, label = "Date d'achat") {
  const result = matching(value, label, /^\d{4}-\d{2}-\d{2}$/);
  if (!result) return null;
  const parsed = new Date(`${result}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== result)
    invalid(label);
  return result;
}

function integer(value: unknown, label: string, max: number) {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || (value as number) < 1 || (value as number) > max) invalid(label);
  return value as number;
}

function item(value: unknown): TicketItem {
  if (!value || typeof value !== "object") invalid("Article");
  const raw = value as Record<string, unknown>;
  const label = text(raw.label, "Nom d'article");
  if (!label) invalid("Nom d'article");
  const quantity = amount(raw.quantity, "Quantité", 0) ?? 1;
  return {
    label,
    reference: text(raw.reference, "Référence", 60),
    quantity: quantity || 1,
    unitPrice: amount(raw.unitPrice, "Prix unitaire"),
    totalPrice: amount(raw.totalPrice, "Prix"),
  };
}

export function readTicketFields(value: unknown): TicketFields {
  if (!value || typeof value !== "object") invalid("Ticket");
  const raw = value as Record<string, unknown>;
  const items = raw.items ?? [];
  if (!Array.isArray(items) || items.length > MAX_ITEMS) invalid("Liste d'articles");

  return {
    name: text(raw.name, "Nom du ticket", 80),
    merchant: text(raw.merchant, "Magasin", 120),
    merchantAddress: text(raw.merchantAddress, "Adresse", 300),
    merchantSiret: matching(raw.merchantSiret, "SIRET", /^\d{9}(\d{5})?$/),
    merchantVat: matching(raw.merchantVat, "N° de TVA", /^[A-Z]{2}[A-Z0-9]{2,13}$/),
    merchantPhone: text(raw.merchantPhone, "Téléphone", 30),
    purchaseDate: date(raw.purchaseDate),
    purchaseTime: matching(raw.purchaseTime, "Heure", /^([01]\d|2[0-3]):[0-5]\d$/),
    ticketNumber: text(raw.ticketNumber, "N° de ticket", 60),
    registerNumber: text(raw.registerNumber, "N° de caisse", 20),
    totalAmount: amount(raw.totalAmount, "Total"),
    currency: matching(raw.currency, "Devise", /^[A-Z]{3}$/) ?? "EUR",
    paymentMethod: text(raw.paymentMethod, "Moyen de paiement", 60),
    cardLast4: matching(raw.cardLast4, "Carte", /^\d{4}$/),
    returnDays: integer(raw.returnDays, "Délai d'échange", 365),
    returnPolicy: text(raw.returnPolicy, "Conditions d'échange", 500),
    warrantyNote: text(raw.warrantyNote, "Mention de garantie", 500),
    // Jamais fournie par l'app : Tico la déduit des articles (coverageInference.ts).
    legalWarranty: null,
    warrantyMonths: integer(raw.warrantyMonths, "Garantie commerciale", 120),
    insuranceName: text(raw.insuranceName, "Assurance", 120),
    insuranceUntil: date(raw.insuranceUntil, "Fin de l'assurance"),
    items: items.map(item),
  };
}

export function readRawText(value: unknown) {
  if (typeof value !== "string") return null;
  return value.slice(0, 20_000).trim() || null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertTicketId(id: string | undefined) {
  if (!id || !UUID_RE.test(id))
    throw createError({ statusCode: 404, message: "Ticket introuvable." });
  return id;
}

const TICKET_FILE_MAX = 4 * 1024 * 1024;

const SIGNATURES: { type: string; bytes: (number | null)[] }[] = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50] },
  { type: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
];

export function detectTicketFile(data: Uint8Array) {
  const match = SIGNATURES.find(({ bytes }) =>
    bytes.every((byte, i) => byte === null || data[i] === byte),
  );
  if (!match)
    throw createError({
      statusCode: 400,
      message: "Format non pris en charge : envoyez une photo ou un PDF.",
    });
  return match.type;
}

export function assertTicketFileSize(data: Uint8Array) {
  if (!data.length)
    throw createError({ statusCode: 400, message: "Le fichier est vide." });
  if (data.length > TICKET_FILE_MAX)
    throw createError({
      statusCode: 413,
      message: "Fichier trop lourd : 4 Mo au maximum.",
    });
}
