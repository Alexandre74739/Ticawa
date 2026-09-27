<template>
  <svg
    aria-hidden="true"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    class="pointer-events-none relative -top-px block h-12 w-full select-none md:h-20"
  >
    <MotionLoop
      v-for="layer in layers"
      :key="layer.d"
      as="g"
      :keyframes="{ x: layer.drift }"
      :duration="layer.duration"
      :class="layer.fill"
    >
      <path :d="layer.d" />
    </MotionLoop>
  </svg>
</template>

<script setup lang="ts">
const layers = [
  {
    d: "M-80 68C180 18 420 98 700 68S1180 18 1520 58V0H-80Z",
    fill: "fill-paper",
    drift: [0, -26, 0],
    duration: 19,
  },
  {
    d: "M-80 86C220 42 480 106 760 80S1240 44 1520 78V0H-80Z",
    fill: "fill-paper/55",
    drift: [0, 20, 0],
    duration: 15,
  },
  {
    d: "M-80 102C240 68 520 116 800 96S1260 68 1520 98V0H-80Z",
    fill: "fill-paper/55",
    drift: [0, -11, 0],
    duration: 12,
  },
];
</script>
