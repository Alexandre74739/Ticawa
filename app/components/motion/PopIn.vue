<template>
  <Motion :as="as" v-bind="popIn(delay)">
    <slot />
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import type { MotionTag } from "~/utils/motion";

withDefaults(defineProps<{ delay?: number; as?: MotionTag }>(), {
  as: "div",
});
</script>
