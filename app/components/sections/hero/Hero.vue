<template>
  <section
    class="relative isolate flex h-[calc(100svh+3rem)] flex-col justify-center overflow-hidden bg-indigo pb-12 text-paper md:h-[calc(100svh+5rem)] md:pb-20"
  >
    <div aria-hidden="true" class="absolute inset-0 -z-10">
      <SectionsHeroGrid />
      <div
        class="absolute -top-72 left-1/2 size-224 -translate-x-1/2 rounded-full bg-lavender/10 blur-3xl"
      />
      <div
        class="absolute top-1/4 -left-64 size-128 rounded-full bg-terracotta/35 blur-3xl"
      />
      <div
        class="absolute top-1/3 -right-56 size-112 rounded-full bg-ink/40 blur-3xl"
      />
    </div>

    <SectionsHeroContent
      :title="title"
      :title-accent="titleAccent"
      :description="description"
      :cta="cta"
    />
    <SectionsHeroMascots />

    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      class="absolute inset-x-0 -bottom-px h-12 w-full fill-paper md:h-20"
    >
      <path
        d="M1440 50C1280 64 1120 118 960 106S640 48 480 22 160 30 0 70V120H1440Z"
      />
    </svg>
  </section>
</template>

<script setup lang="ts">
import type { SectionLink } from "#shared/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  cta: SectionLink;
}>();
</script>
