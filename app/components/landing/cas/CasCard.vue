<template>
  <MotionReveal
    :delay="index * 0.15"
    class="h-full"
    :class="{ 'md:-mt-10': raised }"
  >
    <article
      class="relative isolate flex h-full flex-col overflow-hidden rounded-4xl bg-lavender p-6 shadow-2xl shadow-indigo/35 ring-1 ring-indigo/10 transition duration-300 hover:-translate-y-1 hover:shadow-indigo/60 md:p-7"
    >
      <Quote
        aria-hidden="true"
        :stroke-width="1.5"
        class="pointer-events-none absolute -top-5 -right-5 -z-10 size-32 rotate-12 text-indigo/15 select-none"
      />

      <span
        class="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-display text-xs font-semibold text-paper"
      >
        <BadgeCheck class="size-3.5" :stroke-width="2.25" />
        Résultat
      </span>

      <h3
        class="mt-5 font-display text-xl leading-[1.2] font-bold tracking-[-0.01em] text-ink"
      >
        {{ item.result }}
      </h3>

      <p class="mt-4 grow text-[15px] leading-relaxed text-ink/75 md:text-base">
        {{ item.text }}
      </p>

      <div class="mt-7 flex items-center gap-3 border-t border-ink/10 pt-5">
        <img
          :src="`/mascotte/${item.mascot}`"
          alt=""
          draggable="false"
          class="size-11 shrink-0 rounded-full bg-paper p-1.5"
        />
        <div class="min-w-0">
          <p class="font-display text-sm font-semibold text-ink">
            {{ item.coverage }}
          </p>
          <UiSourceLink :source="item.source" />
        </div>
      </div>
    </article>
  </MotionReveal>
</template>

<script setup lang="ts">
import { BadgeCheck, Quote } from "@lucide/vue";
import type { CaseStudy } from "#shared/types/sections";

defineProps<{
  item: CaseStudy;
  index: number;
  raised?: boolean;
}>();
</script>
