<template>
  <span class="block">
    <span class="sr-only">{{ text }}</span>
    <template v-for="(word, i) in words" :key="i">
      <motion.span
        aria-hidden="true"
        class="inline-block align-bottom"
        :initial="{ y: '0.45em', opacity: 0, filter: 'blur(8px)' }"
        :animate="{ y: '0em', opacity: 1, filter: 'blur(0px)' }"
        :transition="{
          duration: 1.8,
          delay: delay + i * stagger,
          ease: EASE_SOFT,
          opacity: {
            duration: 1.2,
            delay: delay + i * stagger,
            ease: 'easeOut',
          },
        }"
      >
        {{ word }}
      </motion.span>
      {{ " " }}
    </template>
  </span>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

const EASE_SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const props = withDefaults(
  defineProps<{ text: string; delay?: number; stagger?: number }>(),
  {
    delay: 0,
    stagger: 0.07,
  },
);

const words = computed(() => props.text.split(" "));
</script>
