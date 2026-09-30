<template>
  <div role="group" :aria-label="label" class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option.label"
      type="button"
      :aria-pressed="model === option.value"
      class="rounded-full px-4 py-1.5 font-display text-sm font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:outline-none"
      :class="
        model === option.value
          ? 'bg-indigo text-paper'
          : 'bg-lavender text-ink hover:bg-indigo/15'
      "
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | undefined">
defineProps<{
  label: string;
  options: readonly { label: string; value: T }[];
}>();

const model = defineModel<T>();
</script>
