<template>
  <section id="commencer" class="bg-paper px-4 pb-24 md:px-8 md:pb-36">
    <MotionReveal
      class="relative isolate mx-auto flex max-w-6xl flex-col gap-8 overflow-hidden rounded-[2.5rem] bg-indigo px-6 py-10 text-paper shadow-2xl shadow-indigo/35 sm:flex-row sm:items-center sm:justify-between sm:gap-16 md:px-12 md:py-12 lg:gap-24"
    >
      <LandingCtaDecor />

      <div class="min-w-0 max-w-xl">
        <h2
          class="font-display text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-4xl"
        >
          {{ title }}
        </h2>
        <p
          class="mt-4 text-base leading-relaxed text-paper/90 md:text-lg"
        >
          {{ description }}
        </p>
      </div>

      <UiButton
        :to="cta.to"
        variant="light"
        arrow
        size="lg"
        class="shrink-0 self-start shadow-xl shadow-ink/25 sm:self-auto"
      >
        {{ cta.label }}
      </UiButton>
    </MotionReveal>
  </section>
</template>

<script setup lang="ts">
import type { SectionLink } from "#shared/types/sections";

defineProps<{
  title: string;
  description: string;
  cta: SectionLink;
}>();
</script>
