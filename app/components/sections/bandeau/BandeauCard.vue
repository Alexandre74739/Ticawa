<template>
  <div class="px-4 pb-20 md:px-8 md:pb-28">
    <MotionReveal
      class="relative isolate mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2.5rem] bg-indigo shadow-2xl shadow-indigo/35 px-6 py-12 text-paper md:grid-cols-[1.15fr_1fr] md:items-center md:gap-16 md:px-12 md:py-16"
    >
      <SectionsBandeauCardIcons />

      <div>
        <h2
          class="font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl"
        >
          {{ title }}
          <span
            class="block font-serif text-[1.1em] font-normal tracking-normal text-lavender italic"
          >
            {{ titleAccent }}
          </span>
        </h2>
        <ul class="mt-6 hidden flex-wrap gap-2 md:flex">
          <li
            v-for="point in points"
            :key="point.label"
            class="inline-flex items-center gap-2 rounded-full bg-ink/25 px-4 py-2 text-sm font-semibold text-paper ring-1 ring-paper/15 backdrop-blur-sm"
          >
            <component
              :is="point.icon"
              :stroke-width="2.25"
              class="size-4 shrink-0 text-lavender"
            />
            {{ point.label }}
          </li>
        </ul>
      </div>
      <div>
        <p class="text-base leading-relaxed text-paper/85 md:text-lg">
          {{ description }}
        </p>
        <UiButton
          v-if="cta"
          :to="cta.to"
          variant="light"
          arrow
          size="lg"
          class="mt-8 shadow-xl shadow-ink/25"
        >
          {{ cta.label }}
        </UiButton>
      </div>
    </MotionReveal>
  </div>
</template>

<script setup lang="ts">
import { BellRing, Hand, ReceiptEuro } from "@lucide/vue";
import type { SectionLink } from "#shared/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cta?: SectionLink;
}>();

const points = [
  { icon: BellRing, label: "Alerte avant l'échéance" },
  { icon: ReceiptEuro, label: "Preuve d'achat à portée" },
  { icon: Hand, label: "Vous gardez la main" },
];
</script>
