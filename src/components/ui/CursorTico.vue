<template>
  <svg
    viewBox="0 0 192 185"
    class="overflow-visible"
    :class="{ angry: mood === 'angry' }"
  >
    <defs>
      <clipPath v-for="(face, key) in faces" :id="`${uid}-${key}`" :key="key">
        <path v-for="d in face.whites" :key="d" :d="d" />
      </clipPath>
    </defs>
    <g transform="translate(0 -92)">
      <g class="rage">
        <path v-for="d in rage" :key="d" :d="d" :class="tone.body" />
      </g>
    </g>
    <path :d="body" :class="tone.body" />
    <g
      v-for="(face, key) in faces"
      :key="key"
      :transform="`translate(${face.offset.join(' ')})`"
    >
      <g class="face" :class="{ shown: shown === key }">
        <path
          v-for="(d, i) in face.extras"
          :key="d"
          class="decor"
          :class="[tone.body, `decor-${key}`]"
          :style="{ animationDelay: `${i * 0.12}s` }"
          :d="d"
        />
        <g :class="{ eye: key !== 'dizzy' }">
          <path v-for="d in face.whites" :key="d" :d="d" :class="tone.white" />
          <g :clip-path="`url(#${uid}-${key})`">
            <g
              v-for="(d, i) in face.pupils"
              :key="d"
              class="pupil"
              :data-look="face.look"
            >
              <path
                :d="d"
                :class="[
                  tone.body,
                  key === 'dizzy' && (i ? 'spin-ccw' : 'spin'),
                ]"
              />
            </g>
            <template v-if="key === 'neutral'">
              <path
                v-for="d in lids"
                :key="d"
                class="lid"
                :d="d"
                :class="tone.body"
              />
            </template>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { body, lids, rage, type Mood } from "~/data/tico";
import { faces } from "~/data/ticoFaces";

const props = defineProps<{ darkBg: boolean; mood: Mood }>();
const uid = useId();

const shown = computed(() => (props.mood === "angry" ? "neutral" : props.mood));
const tone = computed(() => {
  if (props.mood === "angry")
    return { body: "fill-terracotta", white: "fill-paper" };
  return props.darkBg
    ? { body: "fill-paper", white: "fill-indigo" }
    : { body: "fill-indigo", white: "fill-paper" };
});
</script>

<style scoped>
path {
  transition: fill 0.3s ease;
}
.face,
.eye,
.rage,
.decor,
.spin,
.spin-ccw {
  transform-box: fill-box;
  transform-origin: center;
}
.face {
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.2s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.face.shown {
  opacity: 1;
  transform: none;
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
.shown .decor {
  animation: bob 1.4s ease-in-out infinite alternate;
}
.shown .decor-dizzy {
  animation: swirl 1s ease-in-out infinite alternate;
}
.shown .decor-perfect {
  animation: twinkle 0.9s ease-in-out infinite alternate;
}
.shown .decor-surprised {
  transform-origin: bottom;
  animation: rise 0.5s ease-in-out infinite alternate;
}
.shown .spin {
  animation: spin 1.2s linear infinite;
}
.shown .spin-ccw {
  animation: spin 1.2s linear infinite reverse;
}
@keyframes bob {
  to {
    transform: translateY(-5px) rotate(4deg);
  }
}
@keyframes swirl {
  from {
    transform: rotate(-14deg);
  }
  to {
    transform: rotate(14deg) scale(1.08);
  }
}
@keyframes twinkle {
  to {
    transform: scale(0.75) rotate(20deg);
  }
}
@keyframes rise {
  to {
    transform: scaleY(0.7);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes fume {
  to {
    transform: translateY(-6px) rotate(3deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .angry .rage,
  .shown .decor,
  .shown .spin,
  .shown .spin-ccw {
    animation: none;
  }
}
</style>
