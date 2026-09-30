export type TicketSource = "photo" | "pdf";

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
