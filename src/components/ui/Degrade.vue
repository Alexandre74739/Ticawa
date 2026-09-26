<template>
  <div aria-hidden="true" class="absolute inset-0 -z-10">
    <MotionLoop
      :keyframes="{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }"
      :duration="16"
      class="absolute -top-32 -left-40 size-112 rounded-full bg-indigo/25 blur-3xl"
    />
    <MotionLoop
      :keyframes="{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }"
      :duration="19"
      class="absolute top-1/4 -right-48 size-128 rounded-full bg-lavender blur-3xl"
    />
    <MotionLoop
      :keyframes="{ x: [0, 30, 0], y: [0, -30, 0] }"
      :duration="22"
      class="absolute -bottom-40 left-1/4 size-96 rounded-full bg-terracotta/10 blur-3xl"
    />
  </div>
</template>
