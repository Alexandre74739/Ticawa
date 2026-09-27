<template>
  <div
    class="relative z-10 mx-auto flex max-w-5xl shrink-0 flex-col items-center px-4 pt-16 text-center"
  >
    <h1
      class="font-display text-[clamp(2.75rem,min(9.5vw,14svh),7.5rem)] leading-[0.95] font-extrabold tracking-[-0.02em]"
    >
      <MotionRevealText :text="title" :delay="0.15" />
      <span
        class="block font-serif text-[1.1em] font-normal tracking-normal text-lavender italic"
      >
        <MotionRevealText :text="titleAccent" :delay="0.5" />
      </span>
    </h1>

    <MotionFadeUp
      as="p"
      :delay="0.9"
      class="mt-6 max-w-2xl text-[15px] leading-relaxed font-medium text-paper md:mt-7 md:text-xl"
    >
      {{ description }}
    </MotionFadeUp>

    <MotionFadeUp :delay="1.05" class="mt-8 md:mt-10">
      <UiButton
        :to="cta.to"
        variant="light"
        size="lg"
        arrow
        class="shadow-xl shadow-ink/25"
      >
        {{ cta.label }}
      </UiButton>
    </MotionFadeUp>
  </div>
</template>

<script setup lang="ts">
import type { SectionLink } from "#shared/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cta: SectionLink;
}>();
</script>
