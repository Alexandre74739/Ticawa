<template>
  <svg
    :viewBox="`0 0 ${qr.size} ${qr.size}`"
    role="img"
    :aria-label="label"
    shape-rendering="crispEdges"
    class="block"
  >
    <rect :width="qr.size" :height="qr.size" class="fill-white" />
    <path :d="path" class="fill-ink" />
  </svg>
</template>

<script setup lang="ts">
import { encode } from "uqr";

const props = defineProps<{ value: string; label: string }>();

const qr = computed(() => encode(props.value, { ecc: "M", border: 2 }));

const path = computed(() =>
  qr.value.data
    .flatMap((row, y) =>
      row.map((dark, x) => (dark ? `M${x} ${y}h1v1h-1z` : "")),
    )
    .join(""),
);
</script>
