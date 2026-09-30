<template>
  <div>
    <DashboardHeading title="Échéances," accent="ce qui expire bientôt" />

    <UiAlert v-if="error" tone="danger">
      Impossible de charger vos échéances. Réessayez dans un instant.
    </UiAlert>

    <ClientOnly v-else-if="data">
      <div class="md:grid md:grid-cols-[20rem_1fr] md:gap-4">
        <DeadlineAside :deadlines="data" class="hidden md:flex" />
        <DeadlineCalendar :deadlines="data" @select="show" />
      </div>
      <DeadlineDayDialog v-model="open" :deadlines="selected" />
      <template #fallback>
        <div class="h-96 rounded-3xl bg-lavender" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Deadline } from "#shared/types/ticket";

useHead({ title: "Échéances" });

const { data, error } = await useFetch<Deadline[]>("/api/deadlines");

const open = ref(false);
const selected = ref<Deadline[]>([]);

function show(deadlines: Deadline[]) {
  selected.value = deadlines;
  open.value = true;
}
</script>
