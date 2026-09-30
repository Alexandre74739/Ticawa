import type { TransactionSql } from "postgres";
import type {
  Ticket,
  TicketFields,
  TicketItem,
  TicketPage,
  TicketSource,
  TicketSummary,
} from "#shared/types/ticket";

function fieldColumns() {
  return useDb()`
    t.name, t.merchant, t.merchant_address as "merchantAddress",
    t.merchant_siret as "merchantSiret", t.merchant_vat as "merchantVat",
    t.merchant_phone as "merchantPhone", t.purchase_date::text as "purchaseDate",
    to_char(t.purchase_time, 'HH24:MI') as "purchaseTime",
    t.ticket_number as "ticketNumber", t.register_number as "registerNumber",
    t.total_amount::text as "totalAmount", t.currency,
    t.payment_method as "paymentMethod", t.card_last4 as "cardLast4",
    t.return_days as "returnDays", t.return_policy as "returnPolicy",
    t.warranty_note as "warrantyNote"
  `;
}

type Row<T> = Omit<T, "totalAmount" | "createdAt"> & {
  totalAmount: string | null;
  createdAt: Date;
};

interface TicketRow extends Row<Omit<Ticket, "items" | "file" | "updatedAt">> {
  fileType: string | null;
  fileSize: number | null;
  updatedAt: Date;
}

interface ItemRow {
  label: string;
  reference: string | null;
  quantity: string;
  unitPrice: string | null;
  totalPrice: string | null;
}

const num = (value: string | null) => (value === null ? null : Number(value));

function toItem(row: ItemRow): TicketItem {
  return {
    ...row,
    quantity: Number(row.quantity),
    unitPrice: num(row.unitPrice),
    totalPrice: num(row.totalPrice),
  };
}

const PAGE_SIZE = 20;

export type TicketStatus = "active" | "expired";

function statusFilter(status: TicketStatus | null) {
  const sql = useDb();
  const expired = sql`coalesce(t.purchase_date + t.return_days < current_date, false)`;
  if (status === "expired") return sql`and ${expired}`;
  if (status === "active") return sql`and not ${expired}`;
  return sql``;
}

function searchFilter(search: string) {
  const sql = useDb();
  if (!search) return sql``;
  const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
  return sql`and (
    f_unaccent(t.name) like f_unaccent(${pattern})
    or f_unaccent(t.merchant) like f_unaccent(${pattern})
    or exists (
      select 1 from ticket_items i
      where i.ticket_id = t.id and f_unaccent(i.label) like f_unaccent(${pattern})
    )
  )`;
}

export async function listTickets(
  userId: string,
  search: string,
  page: number,
  status: TicketStatus | null,
): Promise<TicketPage> {
  const sql = useDb();
  const [rows, [counts]] = await Promise.all([
    sql<Row<TicketSummary>[]>`
      select t.id, t.source, t.verified, t.name, t.merchant, t.currency,
        t.return_days as "returnDays", t.purchase_date::text as "purchaseDate",
        t.total_amount::text as "totalAmount", t.created_at as "createdAt",
        (select count(*)::int from ticket_items i where i.ticket_id = t.id) as "itemCount"
      from tickets t
      where t.user_id = ${userId} ${searchFilter(search)} ${statusFilter(status)}
      order by coalesce(t.purchase_date, '-infinity'::date) desc, t.id desc
      limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}
    `,
    sql<{ total: number }[]>`
      select count(*)::int as total
      from tickets t where t.user_id = ${userId} ${searchFilter(search)} ${statusFilter(status)}
    `,
  ]);

  return {
    items: rows.map((r) => ({
      ...r,
      totalAmount: num(r.totalAmount),
      createdAt: r.createdAt.toISOString(),
    })),
    total: counts!.total,
    pages: Math.max(1, Math.ceil(counts!.total / PAGE_SIZE)),
  };
}

export async function findTicket(userId: string, id: string): Promise<Ticket | undefined> {
  const sql = useDb();
  const [row] = await sql<TicketRow[]>`
    select t.id, t.source, t.verified, t.raw_text as "rawText",
      t.created_at as "createdAt", t.updated_at as "updatedAt",
      f.mime_type as "fileType", f.size as "fileSize", ${fieldColumns()}
    from tickets t left join ticket_files f on f.ticket_id = t.id
    where t.id = ${id} and t.user_id = ${userId}
  `;
  if (!row) return undefined;

  const items = await sql<ItemRow[]>`
    select label, reference, quantity::text as quantity,
      unit_price::text as "unitPrice", total_price::text as "totalPrice"
    from ticket_items where ticket_id = ${id} order by position
  `;
  const { fileType, fileSize, ...ticket } = row;
  return {
    ...ticket,
    totalAmount: num(row.totalAmount),
    items: items.map(toItem),
    file: fileType ? { type: fileType, size: fileSize ?? 0 } : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function columns({ items: _items, ...fields }: TicketFields) {
  return {
    name: fields.name,
    merchant: fields.merchant,
    merchant_address: fields.merchantAddress,
    merchant_siret: fields.merchantSiret,
    merchant_vat: fields.merchantVat,
    merchant_phone: fields.merchantPhone,
    purchase_date: fields.purchaseDate,
    purchase_time: fields.purchaseTime,
    ticket_number: fields.ticketNumber,
    register_number: fields.registerNumber,
    total_amount: fields.totalAmount,
    currency: fields.currency,
    payment_method: fields.paymentMethod,
    card_last4: fields.cardLast4,
    return_days: fields.returnDays,
    return_policy: fields.returnPolicy,
    warranty_note: fields.warrantyNote,
  };
}

async function insertItems(tx: TransactionSql, ticketId: string, items: TicketItem[]) {
  if (!items.length) return;
  const rows = items.map((item, position) => ({
    ticket_id: ticketId,
    position,
    label: item.label,
    reference: item.reference,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
  }));
  await tx`insert into ticket_items ${tx(rows)}`;
}

interface TicketUpload {
  source: TicketSource;
  fields: TicketFields;
  rawText: string | null;
  file: { type: string; data: Uint8Array };
}

export async function createTicket(userId: string, upload: TicketUpload) {
  return useDb().begin(async (tx) => {
    const row = {
      user_id: userId,
      source: upload.source,
      raw_text: upload.rawText,
      ...columns(upload.fields),
    };
    const [ticket] = await tx<{ id: string }[]>`
      insert into tickets ${tx(row)} returning id
    `;
    await insertItems(tx, ticket!.id, upload.fields.items);
    await tx`
      insert into ticket_files (ticket_id, mime_type, size, content)
      values (${ticket!.id}, ${upload.file.type}, ${upload.file.data.length}, ${upload.file.data})
    `;
    return ticket!.id;
  });
}

export async function updateTicket(userId: string, id: string, fields: TicketFields) {
  return useDb().begin(async (tx) => {
    const updated = await tx`
      update tickets set ${tx(columns(fields))}, verified = true, updated_at = now()
      where id = ${id} and user_id = ${userId}
      returning id
    `;
    if (!updated.length) return false;
    await tx`delete from ticket_items where ticket_id = ${id}`;
    await insertItems(tx, id, fields.items);
    return true;
  });
}

export async function deleteTicket(userId: string, id: string) {
  const rows = await useDb()`
    delete from tickets where id = ${id} and user_id = ${userId} returning id
  `;
  return rows.length > 0;
}

export async function findTicketFile(userId: string, id: string) {
  const [row] = await useDb()<{ mimeType: string; content: Uint8Array; source: TicketSource; createdAt: Date }[]>`
    select f.mime_type as "mimeType", f.content, t.source, t.created_at as "createdAt"
    from ticket_files f join tickets t on t.id = f.ticket_id
    where t.id = ${id} and t.user_id = ${userId}
  `;
  return row;
}

export function listTicketsForExport(userId: string) {
  return useDb()`
    select t.id, t.source, t.verified, ${fieldColumns()},
      t.raw_text as "rawText", t.created_at as "createdAt",
      t.updated_at as "updatedAt",
      coalesce((
        select json_agg(json_build_object(
          'label', i.label, 'reference', i.reference, 'quantity', i.quantity,
          'unitPrice', i.unit_price, 'totalPrice', i.total_price
        ) order by i.position)
        from ticket_items i where i.ticket_id = t.id
      ), '[]') as items
    from tickets t where t.user_id = ${userId}
    order by t.created_at
  `;
}
