<template>
  <section id="rappels" class="-mt-16 md:-mt-28">
    <LandingBandeauRace class="block h-40 w-full md:h-56 lg:h-64" />
    <LandingBandeauCard
      :title="title"
      :description="description"
      :cta="cta"
    />
  </section>
</template>

<script setup lang="ts">
import type { SectionLink } from "#shared/types/sections";

defineProps<{
  title: string;
  description: string;
  cta?: SectionLink;
}>();
</script>
