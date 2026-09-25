<template>
  <div
    aria-hidden="true"
    class="pointer-events-none relative isolate grid aspect-[4/3.4] place-items-center select-none"
  >
    <div class="absolute inset-0 -z-10 rounded-[2.5rem] bg-lavender" />
    <MotionLoop
      v-for="(ring, i) in rings"
      :key="i"
      :keyframes="{ rotate: ring.rotate, scale: ring.scale }"
      :duration="duration + ring.speed"
      class="absolute inset-0 rounded-[2.5rem] border-indigo"
      :class="ring.style"
    />

    <MotionLoop
      :keyframes="{
        x: ['0%', '9%', '-7%', '4%', '0%'],
        rotate: [0, 4, -3, 2, 0],
      }"
      :duration="14 + duration"
      class="flex w-full flex-col items-center"
    >
      <motion.img
        :src="`/mascotte/${mascot}`"
        alt=""
        draggable="false"
        class="w-2/5 max-w-44 min-w-20 origin-bottom"
        :animate="{
          y: [0, -14, 0],
          scaleX: [1, 0.96, 1.04, 1],
          scaleY: [1, 1.05, 0.96, 1],
        }"
        :transition="{
          y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          scaleX: { duration: 4.3, repeat: Infinity, ease: 'easeInOut' },
          scaleY: { duration: 4.3, repeat: Infinity, ease: 'easeInOut' },
        }"
      />
      <MotionLoop
        :keyframes="{ scaleX: [1, 0.75, 1], opacity: [1, 0.6, 1] }"
        :duration="3.2"
        class="mt-4 h-3 w-1/4 min-w-14 rounded-full bg-indigo/25 blur-sm"
      />
    </MotionLoop>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

withDefaults(defineProps<{ mascot: string; duration?: number }>(), {
  duration: 5,
});

const rings = [
  {
    style: "border-[3px]",
    rotate: [-4, 3, -4],
    scale: [1.04, 1.08, 1.04],
    speed: 7,
  },
  {
    style: "border-2 opacity-50",
    rotate: [6, -2, 6],
    scale: [1.1, 1.05, 1.1],
    speed: 9,
  },
  {
    style: "border-2 opacity-25",
    rotate: [-9, -4, -9],
    scale: [1.16, 1.12, 1.16],
    speed: 11,
  },
];
</script>
