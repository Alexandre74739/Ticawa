<template>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-100 transition-opacity duration-300"
    :class="enabled && visible ? 'opacity-100' : 'opacity-0'"
  >
    <canvas ref="canvas" class="absolute inset-0 size-full" />
    <div
      ref="tico"
      class="absolute top-0 left-0 -mt-5.5 -ml-5.5 size-11 will-change-transform"
    >
      <UiCursorTico
        :on-dark="onDark"
        :angry="angry"
        class="size-full drop-shadow-[0_6px_8px_rgb(42_46_58/0.18)] transition-transform duration-300"
        :class="hovering && 'scale-115'"
      />
    </div>
    <div ref="dot" class="absolute top-0 left-0 will-change-transform">
      <span
        class="absolute rounded-full border-2 transition-all duration-300 ease-out"
        :class="[
          tone.ring,
          hovering
            ? '-top-4 -left-4 size-8 bg-transparent'
            : ['-top-1.25 -left-1.25 size-2.5', tone.fill],
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const dot = ref<HTMLElement | null>(null);
const tico = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const { enabled, visible, onDark, hovering, angry } = useCursor(
  dot,
  tico,
  canvas,
);

const tone = computed(() => {
  if (angry.value)
    return {
      ring: "border-terracotta ring-2 ring-paper/70",
      fill: "bg-terracotta",
    };
  return onDark.value
    ? { ring: "border-paper ring-2 ring-indigo/50", fill: "bg-paper" }
    : { ring: "border-indigo ring-2 ring-paper/70", fill: "bg-indigo" };
});
</script>
