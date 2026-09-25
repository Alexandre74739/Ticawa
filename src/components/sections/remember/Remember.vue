<template>
  <section id="rappels" class="bg-paper px-4 pb-24 md:px-8 md:pb-36">
    <motion.div
      v-bind="revealOnScroll(0, 48)"
      class="relative isolate mx-auto grid max-w-6xl items-center gap-12 overflow-hidden rounded-[3rem] bg-indigo px-6 py-16 text-paper md:grid-cols-5 md:gap-16 md:px-14 md:py-24"
    >
      <div
        aria-hidden="true"
        class="absolute -right-32 -bottom-48 -z-10 size-112 rounded-full bg-terracotta/30 blur-3xl"
      />

      <div class="md:col-span-3">
        <h2
          class="font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-6xl"
        >
          {{ title }}
          <span
            class="block font-serif text-[1.1em] font-normal tracking-normal text-lavender italic"
          >
            {{ titleAccent }}
          </span>
        </h2>
        <p
          class="mt-6 max-w-xl text-base leading-relaxed text-paper/85 md:text-lg"
        >
          {{ description }}
        </p>
        <Button
          v-if="cta"
          :to="cta.to"
          variant="light"
          size="lg"
          arrow
          class="mt-10 shadow-xl shadow-ink/25"
        >
          {{ cta.label }}
        </Button>
      </div>

      <SectionsRememberBell class="md:col-span-2" />
    </motion.div>
  </section>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import type { SectionLink } from "~/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cta?: SectionLink;
}>();
</script>
