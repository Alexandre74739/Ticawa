<template>
  <SettingsPanel :icon="ShoppingBag" title="Articles">
    <p v-if="!ticket.items.length" class="text-sm text-ink/60">
      Tico n'a repéré aucun article. Ajoutez ceux qui comptent pour vous en
      modifiant la fiche.
    </p>
    <ul v-else class="divide-y divide-ink/10">
      <li
        v-for="(item, i) in ticket.items"
        :key="i"
        class="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
      >
        <span class="min-w-0">
          <span class="block font-medium wrap-break-word">{{
            item.label
          }}</span>
          <span v-if="itemNote(item)" class="block text-xs text-ink/55">
            {{ itemNote(item) }}
          </span>
        </span>
        <span class="shrink-0 font-display font-bold">
          {{ formatMoney(item.totalPrice, ticket.currency) ?? "—" }}
        </span>
      </li>
    </ul>
  </SettingsPanel>

  <div class="grid gap-4 md:grid-cols-2">
    <SettingsPanel
      v-for="group in ticketGroups"
      :key="group.title"
      :icon="group.icon"
      :title="group.title"
    >
      <dl class="grid gap-3">
        <div
          v-for="field in group.fields.filter((f) => !f.formOnly)"
          :key="field.key"
        >
          <dt class="text-xs font-semibold tracking-wide text-ink/55 uppercase">
            {{ field.label.replace(/ \(.*\)$/, "") }}
          </dt>
          <dd v-if="display(field)" class="mt-0.5 wrap-break-word">
            {{ display(field) }}
          </dd>
          <dd v-else class="mt-0.5 text-ink/40 italic">Non lu</dd>
        </div>
      </dl>
    </SettingsPanel>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from "@lucide/vue";
import type { Ticket, TicketItem } from "#shared/types/ticket";
import { ticketGroups, type TicketFieldDef } from "~/data/ticketFields";

const props = defineProps<{ ticket: Ticket }>();

const display = (field: TicketFieldDef) => {
  const value = field.show ? field.show(props.ticket) : props.ticket[field.key];
  return value === null || value === "" ? null : String(value);
};

const itemNote = (item: TicketItem) =>
  [
    item.quantity !== 1 &&
      `${item.quantity} × ${formatMoney(item.unitPrice, props.ticket.currency)}`,
    item.reference && `Réf. ${item.reference}`,
  ]
    .filter(Boolean)
    .join(" · ");
</script>
