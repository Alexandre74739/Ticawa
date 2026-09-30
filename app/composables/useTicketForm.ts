import type { Ticket, TicketFields } from "#shared/types/ticket";
import { ticketGroups, type TicketFieldKey } from "~/data/ticketFields";

export interface ItemDraft {
  label: string;
  reference: string;
  quantity: string;
  totalPrice: string;
}

const KEYS = ticketGroups.flatMap((group) => group.fields.map((f) => f.key));

const str = (value: unknown) =>
  typeof value === "number"
    ? String(value).replace(".", ",")
    : typeof value === "string"
      ? value
      : "";
const blank = (value: string) => value.trim() || null;
const num = (value: string) => {
  const clean = value.replace(/[\s€]/g, "").replace(",", ".");
  return clean ? Number(clean) : null;
};

export function useTicketForm(ticket: Ticket) {
  const values = reactive(
    Object.fromEntries(KEYS.map((key) => [key, str(ticket[key])])) as Record<TicketFieldKey, string>,
  );
  const items = ref<ItemDraft[]>(
    ticket.items.map((item) => ({
      label: item.label,
      reference: item.reference ?? "",
      quantity: str(item.quantity),
      totalPrice: str(item.totalPrice),
    })),
  );

  function toFields(): TicketFields {
    const days = num(values.returnDays);
    return {
      ...(Object.fromEntries(KEYS.map((key) => [key, blank(values[key])])) as Record<TicketFieldKey, string | null>),
      merchantSiret: blank(values.merchantSiret.replace(/\s/g, "")),
      merchantVat: blank(values.merchantVat.replace(/\s/g, "").toUpperCase()),
      totalAmount: num(values.totalAmount),
      returnDays: days === null ? null : Math.round(days),
      currency: ticket.currency,
      items: items.value
        .filter((item) => item.label.trim())
        .map((item) => {
          const quantity = num(item.quantity) ?? 1;
          const total = num(item.totalPrice);
          return {
            label: item.label.trim(),
            reference: blank(item.reference),
            quantity,
            totalPrice: total,
            unitPrice: total === null ? null : Math.round((total / quantity) * 100) / 100,
          };
        }),
    };
  }

  const addItem = () =>
    items.value.push({ label: "", reference: "", quantity: "1", totalPrice: "" });
  const removeItem = (index: number) => items.value.splice(index, 1);

  return { values, items, toFields, addItem, removeItem };
}
