<template>
  <Motion
    :as="as"
    v-bind="loop(keyframes, duration, { delay, repeatDelay, ease })"
  >
    <slot />
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import type { LoopEase, MotionTag } from "~/utils/motion";

withDefaults(
  defineProps<{
    keyframes: Record<string, (number | string)[]>;
    duration: number;
    delay?: number;
    repeatDelay?: number;
    ease?: LoopEase;
    as?: MotionTag;
  }>(),
  { as: "div" },
);
</script>
