<template>
  <section
    id="cas-concrets"
    class="bg-paper px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-36"
  >
    <div class="mx-auto max-w-6xl">
      <MotionReveal class="max-w-3xl">
        <h2
          class="font-display text-3xl leading-[1.05] font-bold tracking-[-0.02em] text-ink md:text-5xl"
        >
          {{ title }}
          <span
            class="block font-serif text-[1.1em] font-normal tracking-normal text-indigo italic"
          >
            {{ titleAccent }}
          </span>
        </h2>
        <p class="mt-5 text-base leading-relaxed text-ink/75 md:text-lg">
          {{ description }}
        </p>
      </MotionReveal>

      <div class="mt-12 grid gap-6 md:mt-20 md:grid-cols-3">
        <SectionsCasCard
          v-for="(item, i) in cases"
          :key="item.result"
          :item="item"
          :index="i"
          :raised="i === 1"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CaseStudy } from "#shared/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cases: CaseStudy[];
}>();
</script>
