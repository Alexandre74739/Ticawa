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
import {
  BellRing,
  CalendarClock,
  ReceiptEuro,
  ShieldCheck,
} from "@lucide/vue";

const icons = [
  {
    is: BellRing,
    place: "top-6 left-[44%] size-14 md:size-20",
    tilt: "rotate-12",
  },
  {
    is: ShieldCheck,
    place: "-top-4 right-4 size-20 md:size-28",
    tilt: "rotate-6",
  },
  {
    is: ReceiptEuro,
    place: "-bottom-8 left-[48%] size-24 md:size-32",
    tilt: "-rotate-12",
  },
  {
    is: CalendarClock,
    place: "right-[6%] bottom-4 size-14 md:size-20",
    tilt: "-rotate-6",
  },
];
</script>
