<template>
  <svg viewBox="0 0 192 185" class="overflow-visible" :class="{ angry }">
    <defs>
      <clipPath v-for="(eye, i) in eyes" :id="`${uid}-${i}`" :key="i">
        <path :d="eye.white" />
      </clipPath>
    </defs>
    <g transform="translate(0 -92)">
      <g class="rage">
        <path v-for="d in rage" :key="d" :d="d" :class="tone.body" />
      </g>
    </g>
    <path :d="body" :class="tone.body" />
    <g v-for="(eye, i) in eyes" :key="i" class="eye">
      <path :d="eye.white" :class="tone.white" />
      <path class="pupil" :d="eye.pupil" :class="tone.body" />
      <g :clip-path="`url(#${uid}-${i})`">
        <path class="lid" :d="eye.lid" :class="tone.body" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { body, eyes, rage } from "~/data/tico";

const props = defineProps<{ onDark: boolean; angry: boolean }>();
const uid = useId();

const tone = computed(() => {
  if (props.angry) return { body: "fill-terracotta", white: "fill-paper" };
  return props.onDark
    ? { body: "fill-paper", white: "fill-indigo" }
    : { body: "fill-indigo", white: "fill-paper" };
});
</script>

<style scoped>
path {
  transition: fill 0.3s ease;
}
.eye,
.rage {
  transform-box: fill-box;
  transform-origin: center;
}
.lid {
  transform: translateY(-100px);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.angry .lid {
  transform: none;
}
.rage {
  transform-origin: bottom;
  opacity: 0;
  transform: scale(0.4);
  transition:
    opacity 0.2s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.angry .rage {
  opacity: 1;
  transform: none;
  animation: fume 0.5s ease-in-out infinite alternate;
}
@keyframes fume {
  to {
    transform: translateY(-6px) rotate(3deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .angry .rage {
    animation: none;
  }
}
</style>
