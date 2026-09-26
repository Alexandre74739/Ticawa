<template>
  <article class="grid items-center gap-14 md:grid-cols-5 md:gap-16 lg:gap-24">
    <MotionReveal
      :y="40"
      class="mx-auto w-3/4 max-w-72 md:col-span-2 md:w-full md:max-w-none"
      :class="{ 'md:order-last': reverse }"
    >
      <UiMascotCard :mascot="feature.mascot" :duration="5 + index" />
    </MotionReveal>

    <MotionReveal :delay="0.15" class="md:col-span-3">
      <h3
        class="font-display text-3xl leading-[1.1] font-bold tracking-[-0.01em] text-ink md:text-5xl"
      >
        {{ feature.title }}
      </h3>
      <p class="mt-5 text-base leading-relaxed text-ink/75 md:text-lg">
        {{ feature.text }}
      </p>
      <ul class="mt-6 flex flex-col gap-3">
        <li
          v-for="item in feature.bullets"
          :key="item"
          class="flex items-start gap-3 font-medium text-ink md:text-lg"
        >
          <span
            class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-indigo/15 text-indigo"
          >
            <Check class="size-3.5" :stroke-width="3" />
          </span>
          {{ item }}
        </li>
      </ul>
      <Button v-if="feature.cta" :to="feature.cta.to" arrow class="mt-8">
        {{ feature.cta.label }}
      </Button>
    </MotionReveal>
  </article>
</template>

<script setup lang="ts">
import { Check } from "@lucide/vue";
import type { ProductFeature } from "~/types/sections";

defineProps<{
  feature: ProductFeature;
  index: number;
  reverse?: boolean;
}>();
</script>
