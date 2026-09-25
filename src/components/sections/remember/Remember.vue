<template>
  <section id="rappels" class="bg-paper px-4 pb-20 md:px-8 md:pb-28">
    <MotionReveal
      :y="48"
      class="relative isolate mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[2.5rem] bg-indigo px-6 py-12 text-paper md:grid-cols-5 md:gap-12 md:px-12 md:py-14"
    >
      <div class="md:col-span-3">
        <h2
          class="font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl"
        >
          {{ title }}
          <span
            class="block font-serif text-[1.1em] font-normal tracking-normal text-lavender italic"
          >
            {{ titleAccent }}
          </span>
        </h2>
        <p class="mt-5 max-w-lg text-base leading-relaxed text-paper/85">
          {{ description }}
        </p>
        <Button
          v-if="cta"
          :to="cta.to"
          variant="light"
          arrow
          class="mt-8 shadow-xl shadow-ink/25"
        >
          {{ cta.label }}
        </Button>
      </div>

      <SectionsRememberDevices class="md:col-span-2" />
    </MotionReveal>
  </section>
</template>

<script setup lang="ts">
import type { SectionLink } from "~/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cta?: SectionLink;
}>();
</script>
