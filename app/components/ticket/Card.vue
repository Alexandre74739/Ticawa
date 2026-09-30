<template>
  <NuxtLink
    :to="`/dashboard/tickets/${ticket.id}`"
    class="group flex items-center gap-4 rounded-3xl p-4 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
    :class="expired ? 'bg-ink/10 hover:bg-ink/15' : 'bg-lavender hover:bg-indigo/15'"
  >
    <span
      class="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper text-indigo shadow-sm shadow-indigo/10"
    >
      <component
        :is="ticket.source === 'pdf' ? FileText : ReceiptText"
        aria-hidden="true"
        class="size-6"
      />
    </span>

    <span class="min-w-0 flex-1">
      <span class="flex items-baseline justify-between gap-3">
        <span class="truncate font-display text-lg font-bold">
          {{ ticket.name ?? ticket.merchant ?? "Magasin inconnu" }}
        </span>
        <span class="shrink-0 font-display font-bold text-indigo">
          {{ formatMoney(ticket.totalAmount, ticket.currency) ?? "—" }}
        </span>
      </span>
      <span class="block text-sm" :class="expired ? 'text-ink/50' : 'text-ink/65'">
        <template v-if="ticket.name && ticket.merchant">
          {{ ticket.merchant }} ·
        </template>
        {{ formatDate(ticket.purchaseDate, "short") ?? "Date à compléter" }}
        <template v-if="ticket.itemCount">
          · {{ ticket.itemCount }} article{{ ticket.itemCount > 1 ? "s" : "" }}
        </template>
      </span>
      <span class="mt-2 flex flex-wrap gap-1.5">
        <UiBadge
          v-if="expired"
          :status="{ ...coverageStatus.expired, label: `Expiré depuis le ${deadline!.deadline}` }"
        />
        <template v-else>
          <UiBadge :status="reviewStatus(ticket.verified)" />
          <UiBadge v-if="deadline?.state === 'soon'" :status="coverageStatus.soon" />
        </template>
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { FileText, ReceiptText } from "@lucide/vue";
import type { TicketSummary } from "#shared/types/ticket";
import { coverageStatus, reviewStatus } from "~/data/ticketFields";

const props = defineProps<{ ticket: TicketSummary }>();

const deadline = computed(() => returnWindow(props.ticket));
const expired = computed(() => deadline.value?.state === "expired");
</script>
