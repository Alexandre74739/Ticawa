<template>
  <UiTico ref="tico" :dark-bg="darkBg" :mood="mood" />
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import type { Mood } from "~/data/tico";

withDefaults(defineProps<{ mood: Mood; darkBg?: boolean }>(), {
  darkBg: false,
});

const tico = ref<ComponentPublicInstance | null>(null);
const svg = ref<SVGSVGElement | null>(null);

onMounted(() => (svg.value = tico.value?.$el ?? null));
useTicoEyes(svg);
</script>
