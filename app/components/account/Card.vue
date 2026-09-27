<template>
  <MotionReveal
    :delay="delay"
    class="rounded-4xl bg-lavender p-5 shadow-lg shadow-indigo/15 md:p-7"
  >
    <div class="flex items-start gap-4">
      <UiTicoMascot :mascot="mascot" :duration="duration" />
      <div class="min-w-0 flex-1">
        <h2 class="font-display text-xl leading-tight font-bold md:text-2xl">
          {{ title }}
          <span
            v-if="accent"
            class="block font-serif text-[1.1em] font-normal text-indigo italic"
          >
            {{ accent }}
          </span>
        </h2>
        <p
          class="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/70 md:text-base"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <div class="mt-5">
      <slot />
    </div>
  </MotionReveal>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  mascot: string;
  accent?: string;
  delay?: number;
  duration?: number;
}>();
</script>
