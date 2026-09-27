<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
  >
    <MotionLoop
      :keyframes="{ x: [0, 40, 0], y: [0, -26, 0], scale: [1, 1.12, 1] }"
      :duration="18"
      class="absolute -top-24 -left-24 size-80 rounded-full bg-lavender/20 blur-3xl"
    />
    <MotionLoop
      :keyframes="{ x: [0, -46, 0], y: [0, 24, 0], scale: [1, 1.1, 1] }"
      :duration="23"
      class="absolute -right-28 bottom-0 size-96 rounded-full bg-terracotta/20 blur-3xl"
    />
  </div>
</template>
