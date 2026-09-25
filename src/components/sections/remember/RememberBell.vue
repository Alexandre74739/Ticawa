<template>
  <div
    aria-hidden="true"
    class="pointer-events-none relative mx-auto grid aspect-square w-full max-w-72 place-items-center select-none md:max-w-sm"
  >
    <motion.span
      v-for="i in 3"
      :key="i"
      class="absolute inset-[18%] rounded-full border-2 border-paper/40"
      :animate="{ scale: [1, 1.7], opacity: [0.8, 0] }"
      :transition="{
        duration: 3.6,
        delay: i * 1.2,
        repeat: Infinity,
        ease: 'easeOut',
      }"
    />
    <div
      class="relative grid size-[64%] place-items-center rounded-full bg-paper shadow-2xl shadow-ink/30"
    >
      <motion.div
        class="origin-top"
        :animate="{ rotate: [0, -14, 11, -7, 4, 0] }"
        :transition="{
          duration: 1.6,
          repeat: Infinity,
          repeatDelay: 2.4,
          ease: 'easeInOut',
        }"
      >
        <BellRing class="size-16 text-indigo md:size-24" :stroke-width="1.75" />
      </motion.div>
      <span
        class="absolute top-[16%] right-[16%] size-5 rounded-full bg-terracotta ring-4 ring-paper md:size-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { BellRing } from "lucide-vue-next";
</script>
