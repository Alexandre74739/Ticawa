<template>
  <motion.span :style="{ opacity }">{{ word }}</motion.span>
</template>

<script setup lang="ts">
import { motion, useTransform, type MotionValue } from "motion-v";

const props = defineProps<{
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}>();

const opacity = useTransform(props.progress, props.range, [0.15, 1]);
</script>
