<template>
  <section class="flex flex-col gap-2 rounded-3xl bg-lavender p-3">
    <div class="flex flex-col gap-2">
      <header class="flex items-center justify-between">
        <button type="button" :class="nav" @click="shift(-1)">
          <ChevronLeft aria-hidden="true" class="size-4" />
          <span class="sr-only">Mois précédent</span>
        </button>
        <h2 class="font-display text-lg font-bold first-letter:uppercase">
          {{ title }}
        </h2>
        <button type="button" :class="nav" @click="shift(1)">
          <ChevronRight aria-hidden="true" class="size-4" />
          <span class="sr-only">Mois suivant</span>
        </button>
      </header>

      <p class="grid grid-cols-7 text-center text-xs font-semibold text-ink/50">
        <span v-for="(day, i) in weekDays" :key="i">{{ day }}</span>
      </p>

      <div class="grid grid-cols-7 grid-rows-[repeat(6,3rem)] gap-1">
        <template v-for="(iso, i) in cells" :key="iso ?? i">
          <DeadlineDay
            v-if="iso"
            :iso="iso"
            :deadlines="byDate[iso] ?? []"
            @select="emit('select', byDate[iso] ?? [])"
          />
          <span v-else />
        </template>
      </div>
    </div>

    <DeadlineLegend class="md:hidden" />
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import type { Deadline } from "#shared/types/ticket";

const props = defineProps<{ deadlines: Deadline[] }>();
const emit = defineEmits<{ select: [deadlines: Deadline[]] }>();

const { title, cells, shift } = useMonthGrid();
const weekDays = ["L", "M", "M", "J", "V", "S", "D"];
const nav =
  "grid size-8 place-items-center rounded-full bg-paper shadow-sm shadow-indigo/10 text-indigo transition-colors hover:bg-indigo hover:text-paper focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none";

const byDate = computed(() => {
  const groups: Record<string, Deadline[]> = {};
  for (const deadline of props.deadlines)
    (groups[deadline.date] ??= []).push(deadline);
  return groups;
});
</script>
