<template>
  <svg
    viewBox="0 0 192 185"
    role="img"
    :aria-labelledby="titleId"
    class="block h-auto w-full fill-current"
  >
    <title :id="titleId">Ticawa</title>
    <path :d="body" />
    <g v-for="eye in eyes" :key="eye.white" class="eye">
      <path :d="eye.white" class="fill-paper" />
      <path :d="eye.pupil" />
    </g>
    <path v-for="d in letters" :key="d" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import raw from "~/assets/logos/Logo-secondary.svg?raw";

const [head = "", ...letters] = [...raw.matchAll(/ d="([^"]+)"/g)].map(
  (m) => m[1]!,
);
const [body, whiteL, pupilL, whiteR, pupilR] = head.split(/(?=M)/);
const eyes = [
  { white: whiteL, pupil: pupilL },
  { white: whiteR, pupil: pupilR },
];

const titleId = useId();
</script>

<style scoped>
.eye {
  transform-box: fill-box;
  transform-origin: center;
}

@media (prefers-reduced-motion: no-preference) {
  .eye {
    animation: tico-blink-idle 6s ease-in-out infinite;
  }

  a:hover .eye,
  a:focus-visible .eye {
    animation: tico-blink 0.3s ease-in-out 2;
  }
}

@keyframes tico-blink {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

@keyframes tico-blink-idle {
  0%,
  90%,
  100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}
</style>
