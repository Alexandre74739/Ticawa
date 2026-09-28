<template>
  <div
    class="flex items-start justify-between gap-4 transition-opacity duration-300"
    :class="disabled && 'opacity-50'"
  >
    <div class="min-w-0">
      <p :id="labelId" class="font-medium">{{ label }}</p>
      <p
        v-if="description"
        :id="descriptionId"
        class="mt-0.5 text-xs leading-relaxed text-ink/60 md:text-sm"
      >
        {{ description }}
      </p>
    </div>
    <button
      type="button"
      role="switch"
      :aria-checked="model"
      :aria-labelledby="labelId"
      :aria-describedby="description ? descriptionId : undefined"
      :disabled="disabled"
      class="relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none disabled:cursor-not-allowed"
      :class="model ? 'bg-indigo' : 'bg-ink/20'"
      @click="model = !model"
    >
      <span
        aria-hidden="true"
        class="size-5.5 rounded-full bg-paper shadow-sm shadow-ink/20 transition-transform duration-300"
        :class="model ? 'translate-x-5.75' : 'translate-x-0.75'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; description?: string; disabled?: boolean }>();
const model = defineModel<boolean>({ required: true });

const labelId = useId();
const descriptionId = useId();
</script>
