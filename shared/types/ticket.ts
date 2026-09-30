export type TicketSource = "photo" | "pdf";

// Garantie légale déduite par Tico des articles : 'none' pour des consommables.
export type LegalWarranty = "new" | "none";

export type CoverageKind = "return" | "legal" | "commercial" | "insurance";

export interface TicketItem {
  label: string;
  reference: string | null;
  quantity: number;
  unitPrice: number | null;
  totalPrice: number | null;
}

export interface TicketFields {
  name: string | null;
  merchant: string | null;
  merchantAddress: string | null;
  merchantSiret: string | null;
  merchantVat: string | null;
  merchantPhone: string | null;
  purchaseDate: string | null;
  purchaseTime: string | null;
  ticketNumber: string | null;
  registerNumber: string | null;
  totalAmount: number | null;
  currency: string;
  paymentMethod: string | null;
  cardLast4: string | null;
  returnDays: number | null;
  returnPolicy: string | null;
  warrantyNote: string | null;
  legalWarranty: LegalWarranty | null;
  warrantyMonths: number | null;
  insuranceName: string | null;
  insuranceUntil: string | null;
  items: TicketItem[];
}

export interface TicketSummary {
  id: string;
  source: TicketSource;
  verified: boolean;
  name: string | null;
  merchant: string | null;
  purchaseDate: string | null;
  totalAmount: number | null;
  currency: string;
  returnDays: number | null;
  legalWarranty: LegalWarranty | null;
  warrantyMonths: number | null;
  insuranceUntil: string | null;
  itemCount: number;
  createdAt: string;
}

export interface Ticket extends TicketFields {
  id: string;
  source: TicketSource;
  verified: boolean;
  rawText: string | null;
  file: { type: string; size: number } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketPage {
  items: TicketSummary[];
  total: number;
  pages: number;
}

// Une date de fin de couverture d'un ticket : échange, garantie ou assurance.
export interface Deadline {
  kind: CoverageKind;
  date: string;
  ticket: TicketSummary;
}

export interface Overview {
  total: number;
  ongoing: number;
  tracked: number;
  deadlines: Deadline[];
  recent: TicketSummary[];
  incomplete: TicketSummary | null;
}
