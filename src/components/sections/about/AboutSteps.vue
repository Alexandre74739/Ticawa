<template>
  <ol class="border-b border-ink/10">
    <motion.li
      v-for="(step, i) in steps"
      :key="step.title"
      v-bind="revealOnScroll(i * 0.1)"
      class="grid gap-3 border-t border-ink/10 py-8 md:grid-cols-[7rem_1fr_1.3fr] md:items-baseline md:gap-10 md:py-12"
    >
      <span class="font-serif text-5xl text-indigo italic md:text-7xl"
        >0{{ i + 1 }}</span
      >
      <h3
        class="font-display text-2xl font-bold tracking-[-0.01em] text-ink md:text-4xl"
      >
        {{ step.title }}
      </h3>
      <p class="text-base leading-relaxed text-ink/75 md:text-lg">
        {{ step.text }}
      </p>
    </motion.li>
  </ol>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import type { AboutStep } from "~/types/sections";

defineProps<{
  steps: AboutStep[];
}>();
</script>
