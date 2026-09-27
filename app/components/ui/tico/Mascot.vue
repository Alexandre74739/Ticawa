<template>
  <div
    aria-hidden="true"
    class="relative grid size-14 shrink-0 place-items-center md:size-16"
  >
    <span
      class="absolute inset-0 rounded-[1.4rem] bg-paper shadow-md shadow-indigo/15"
    />
    <MotionLoop
      :keyframes="{ y: [0, -4, 0], rotate: [-4, 4, -4] }"
      :duration="duration"
      class="relative w-8 md:w-9"
    >
      <img
        :src="`/mascotte/${mascot}`"
        alt=""
        draggable="false"
        class="w-full drop-shadow-sm"
      />
    </MotionLoop>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ mascot: string; duration?: number }>(), {
  duration: 4,
});
</script>
