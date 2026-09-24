<template>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 hidden h-svh md:block">
    <motion.div
      v-for="(mascot, i) in mascots"
      :key="mascot.src"
      class="absolute"
      :class="mascot.place"
      :initial="{ opacity: 0, scale: 0.6 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 0.8, delay: 1.4 + i * 0.2, ease: EASE_OUT }"
    >
      <motion.img
        :src="`/mascotte/${mascot.src}`"
        alt=""
        class="brightness-0 invert"
        :class="mascot.size"
        :animate="{
          y: [0, -14, 0],
          rotate: [mascot.rotate, mascot.rotate + 5, mascot.rotate],
        }"
        :transition="{
          duration: 5 + i * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }"
      />
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

const mascots = [
  {
    src: "Happy.svg",
    place: "top-[20%] left-[6%]",
    size: "w-24 lg:w-32",
    rotate: -12,
  },
  {
    src: "Perfect.svg",
    place: "top-[52%] right-[5%]",
    size: "w-28 lg:w-40",
    rotate: 10,
  },
  {
    src: "Neutre.svg",
    place: "bottom-[10%] left-[14%]",
    size: "w-20 lg:w-24",
    rotate: 8,
  },
];
</script>
