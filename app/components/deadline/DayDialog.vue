<template>
  <UiModal v-model="open" :labelledby="titleId">
    <h2 :id="titleId" class="font-display text-xl font-extrabold">
      Fin d'échange le
      <span class="text-indigo">{{ deadline?.deadline }}</span>
    </h2>

    <ul class="mt-4 flex max-h-[55vh] flex-col gap-2 overflow-y-auto">
      <li v-for="ticket in tickets" :key="ticket.id">
        <NuxtLink
          :to="`/dashboard/tickets/${ticket.id}`"
          class="flex items-center justify-between gap-3 rounded-2xl bg-lavender px-4 py-3 transition-colors duration-300 hover:bg-indigo/15 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
        >
          <span class="truncate font-display font-bold">
            {{ ticket.name ?? ticket.merchant ?? "Magasin inconnu" }}
          </span>
          <ChevronRight
            aria-hidden="true"
            class="size-4 shrink-0 text-indigo"
          />
        </NuxtLink>
      </li>
    </ul>
  </UiModal>
</template>

<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";
import type { TicketSummary } from "#shared/types/ticket";

const props = defineProps<{ tickets: TicketSummary[] }>();
const open = defineModel<boolean>({ required: true });

const titleId = useId();
const deadline = computed(() =>
  props.tickets[0] ? returnWindow(props.tickets[0]) : null,
);
</script>
