<template>
  <div
    aria-hidden="true"
    class="pointer-events-none relative mx-auto aspect-[5/4] w-full max-w-sm select-none md:max-w-none"
  >
    <div
      class="absolute right-[5%] bottom-0 -z-10 aspect-square w-3/4 rounded-full bg-terracotta/35 blur-3xl"
    />
    <div class="absolute -inset-[15%] -z-10">
      <SectionsRememberWaves />
    </div>

    <MotionReveal
      v-for="(device, i) in devices"
      :key="device.src"
      :delay="0.1 + i * 0.2"
      class="absolute"
      :class="device.place"
    >
      <MotionLoop
        :keyframes="{ y: [0, -8, 0], rotate: device.rotate }"
        :duration="7 - i"
        :delay="i"
      >
        <img
          :src="`/mockups/${device.src}`"
          alt=""
          draggable="false"
          class="w-full drop-shadow-2xl drop-shadow-ink/40"
        />
      </MotionLoop>
    </MotionReveal>
  </div>
</template>

<script setup lang="ts">
const devices = [
  { src: "mockup-pc.png", place: "top-0 left-0 w-[82%]", rotate: [-3, -2, -3] },
  {
    src: "mockup-mobile.png",
    place: "right-0 bottom-0 w-[40%]",
    rotate: [3, 2, 3],
  },
];
</script>
