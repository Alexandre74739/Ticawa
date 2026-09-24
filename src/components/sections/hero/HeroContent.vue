<template>
  <div
    class="relative z-10 mx-auto flex max-w-5xl shrink-0 flex-col items-center px-4 pt-16 text-center"
  >
    <h1
      class="font-display text-[clamp(2.75rem,min(9.5vw,14svh),7.5rem)] leading-[0.95] font-extrabold tracking-[-0.02em]"
    >
      <UiRevealText :text="title" :delay="0.15" />
      <span
        class="block font-serif text-[1.1em] font-normal tracking-normal text-lavender italic"
      >
        <UiRevealText :text="titleAccent" :delay="0.5" />
      </span>
    </h1>

    <motion.p
      v-bind="fadeUp(0.9)"
      class="mt-6 max-w-2xl text-[15px] leading-relaxed font-medium text-paper md:mt-7 md:text-xl"
    >
      {{ description }}
    </motion.p>

    <motion.div v-bind="fadeUp(1.05)" class="mt-8 md:mt-10">
      <Button
        :to="cta.to"
        variant="light"
        size="lg"
        arrow
        class="shadow-xl shadow-ink/25"
      >
        {{ cta.label }}
      </Button>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import type { SectionLink } from "~/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cta: SectionLink;
}>();
</script>
