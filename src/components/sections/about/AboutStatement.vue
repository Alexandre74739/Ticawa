<template>
  <h2
    ref="target"
    class="max-w-5xl font-display text-3xl leading-[1.15] font-bold tracking-[-0.02em] text-ink sm:text-4xl md:text-6xl"
  >
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(word, i) in words" :key="i">
        <UiScrollWord
          :word="word"
          :progress="scrollYProgress"
          :range="[i / words.length, (i + 1) / words.length]"
          :class="{ 'text-indigo': highlight && word.startsWith(highlight) }"
        />
        {{ " " }}
      </template>
    </span>
  </h2>
</template>

<script setup lang="ts">
import { useScroll } from "motion-v";

const props = defineProps<{
  text: string;
  highlight?: string;
}>();

const words = computed(() => props.text.split(" "));

const target = ref<HTMLElement | null>(null);
const { scrollYProgress } = useScroll({
  target,
  offset: ["start 0.85", "end 0.45"],
});
</script>
