<template>
  <MotionReveal class="mb-8">
    <h1
      class="font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-4xl 2xl:text-5xl"
    >
      {{ title }}
      <span
        class="block text-indigo"
      >
        {{ accent }}
      </span>
    </h1>
    <p v-if="$slots.default" class="mt-4 max-w-2xl leading-relaxed text-ink/75">
      <slot />
    </p>
  </MotionReveal>
</template>

<script setup lang="ts">
defineProps<{ title: string; accent: string }>();
</script>
