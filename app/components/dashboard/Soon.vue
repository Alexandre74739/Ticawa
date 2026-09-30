<template>
  <div
    class="flex flex-col items-center gap-4 rounded-3xl bg-lavender px-6 py-12 text-center"
  >
    <UiTicoMascot :mascot="mascot" />
    <p class="font-display text-lg font-bold">{{ title }}</p>
    <p class="max-w-sm text-ink/70"><slot /></p>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; mascot?: string }>(), {
  title: "Tico prépare cette page",
  mascot: "Neutre.svg",
});
</script>
