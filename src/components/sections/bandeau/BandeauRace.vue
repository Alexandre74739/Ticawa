<template>
  <svg
    ref="root"
    :viewBox="`0 -265 ${VIEW_W} ${GROUND + 269}`"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
    class="pointer-events-none select-none"
  >
    <defs>
      <path
        v-for="(shape, i) in dustShapes"
        :id="`race-dust-${i}`"
        :key="i"
        :d="shape.d"
        :transform="`translate(${-shape.cx} ${-shape.cy})`"
      />
    </defs>

    <ellipse
      v-for="r in runners"
      :key="r.x"
      data-shadow
      rx="88"
      ry="10"
      class="fill-indigo/20"
      :transform="`translate(${REST_BASE + r.x + 106} ${GROUND})`"
    />
    <use v-for="n in 48" :key="n" data-dust opacity="0" class="fill-indigo" />

    <g data-sign :transform="restSign">
      <SectionsBandeauSign />
    </g>
    <g v-for="r in runners" :key="r.x" data-runner :transform="restPose(r.x)">
      <SectionsBandeauTico :mood="r.mood" width="220" height="212" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import {
  dustShapes,
  GROUND,
  runners,
  SIGN_FOOT,
  SIGN_GRIP,
  VIEW_W,
} from "~/data/race";
import { REST_BASE, restPose } from "~/composables/useRace";

const happy = runners.find((r) => r.mood === "happy")!;
const restSign = `translate(${REST_BASE + happy.x + SIGN_GRIP.x} ${GROUND - 53}) rotate(2) translate(${-SIGN_FOOT.x} ${-SIGN_FOOT.y})`;

const root = ref<SVGSVGElement | null>(null);
useRace(root);
</script>
