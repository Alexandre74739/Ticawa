<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 select-none"
  >
    <MotionPopIn
      v-for="(mascot, i) in mascots"
      :key="mascot.src"
      :delay="0.5 + i * 0.15"
      class="absolute"
      :class="mascot.place"
    >
      <MotionLoop
        :keyframes="{
          y: [0, -12, 0],
          rotate: [mascot.tilt, mascot.tilt + 6, mascot.tilt],
        }"
        :duration="5 + i * 1.4"
      >
        <img
          :src="`/mascotte/${mascot.src}`"
          alt=""
          draggable="false"
          class="w-full brightness-0 invert"
          :class="mascot.opacity"
        />
      </MotionLoop>
    </MotionPopIn>
  </div>
</template>

<script setup lang="ts">
const mascots = [
  {
    src: "Perfect.svg",
    place: "-top-4 right-[3%] w-16 md:w-24",
    tilt: 12,
    opacity: "opacity-20",
  },
  {
    src: "Neutre.svg",
    place: "-bottom-4 right-[14%] w-14 md:w-20",
    tilt: -14,
    opacity: "opacity-15",
  },
  {
    src: "Surprised.svg",
    place: "top-[34%] right-[24%] w-10 md:w-14",
    tilt: 6,
    opacity: "opacity-10",
  },
];
</script>
