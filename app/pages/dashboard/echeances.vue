<template>
  <div>
    <DashboardHeading title="Échéances," accent="ce qui expire bientôt" />

    <UiAlert v-if="error" tone="danger">
      Impossible de charger vos échéances. Réessayez dans un instant.
    </UiAlert>

    <ClientOnly v-else-if="data">
      <div class="md:grid md:grid-cols-[20rem_1fr] md:gap-4">
        <DeadlineAside :tickets="data" class="hidden md:flex" />
        <DeadlineCalendar :tickets="data" @select="show" />
      </div>
      <DeadlineDayDialog v-model="open" :tickets="selected" />
      <template #fallback>
        <div class="h-96 rounded-3xl bg-lavender" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { TicketSummary } from "#shared/types/ticket";

useHead({ title: "Échéances" });

const { data, error } = await useFetch<TicketSummary[]>("/api/deadlines");

const open = ref(false);
const selected = ref<TicketSummary[]>([]);

function show(tickets: TicketSummary[]) {
  selected.value = tickets;
  open.value = true;
}
</script>
