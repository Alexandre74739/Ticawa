<template>
  <button
    v-if="tickets.length"
    type="button"
    class="group relative grid place-items-center rounded-xl bg-paper shadow-sm shadow-indigo/10 transition-colors duration-300 hover:bg-indigo/10 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
    :aria-label="`${day} : ${tickets.length} échéance(s)`"
    @click="emit('select')"
  >
    <span class="absolute top-1 left-1.5 text-xs font-semibold text-ink/60">
      {{ day }}
    </span>
    <img
      :src="`/mascotte/${soon ? 'Surprised' : 'Neutre'}.svg`"
      alt=""
      draggable="false"
      class="w-6 transition-transform duration-300"
      :class="[
        soon
          ? 'group-hover:-translate-y-1 group-hover:scale-125'
          : 'group-hover:scale-110 group-hover:-rotate-12',
        expired && 'opacity-35 grayscale',
      ]"
    />
    <span
      v-if="tickets.length > 1"
      class="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-indigo text-[0.6rem] font-bold text-paper"
    >
      {{ tickets.length }}
    </span>
  </button>
  <span
    v-else
    class="grid place-items-center rounded-xl bg-paper/40 text-xs text-ink/50"
  >
    {{ day }}
  </span>
</template>

<script setup lang="ts">
import type { TicketSummary } from "#shared/types/ticket";

const props = defineProps<{ iso: string; tickets: TicketSummary[] }>();
const emit = defineEmits<{ select: [] }>();

const day = computed(() => Number(props.iso.slice(8)));
const daysLeft = computed(() =>
  props.tickets[0] ? (returnWindow(props.tickets[0])?.daysLeft ?? 0) : 0,
);
const expired = computed(() => daysLeft.value < 0);
const soon = computed(() => !expired.value && daysLeft.value < 15);
</script>
