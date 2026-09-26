<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 select-none"
  >
    <MotionLoop
      v-for="(icon, i) in icons"
      :key="i"
      :keyframes="{ y: [0, -10, 0] }"
      :duration="6 + i * 1.3"
      :delay="i * 0.7"
      class="absolute"
      :class="icon.place"
    >
      <component
        :is="icon.is"
        :stroke-width="1.5"
        class="size-full text-paper/10"
        :class="icon.tilt"
      />
    </MotionLoop>
  </div>
</template>

<script setup lang="ts">
import { Camera, FileCheck2, Smartphone, Sparkles } from "@lucide/vue";

const icons = [
  {
    is: Camera,
    place: "-top-4 left-[2%] size-16 md:size-24",
    tilt: "-rotate-12",
  },
  {
    is: Sparkles,
    place: "top-6 left-[44%] size-12 md:size-16",
    tilt: "rotate-6",
  },
  {
    is: FileCheck2,
    place: "-bottom-6 left-[54%] size-20 md:size-28",
    tilt: "rotate-12",
  },
  {
    is: Smartphone,
    place: "-top-6 right-[8%] size-16 md:size-24",
    tilt: "-rotate-6",
  },
];
</script>
