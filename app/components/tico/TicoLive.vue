<template>
  <Tico ref="tico" :dark-bg="false" :mood="mood" />
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import type { Mood } from "~/data/tico";

defineProps<{ mood: Mood }>();

const tico = ref<ComponentPublicInstance | null>(null);
const svg = ref<SVGSVGElement | null>(null);

onMounted(() => (svg.value = tico.value?.$el ?? null));
useTicoEyes(svg);
</script>
