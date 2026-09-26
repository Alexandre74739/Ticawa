<template>
  <section id="produit" class="overflow-x-clip bg-paper px-4 pb-24 md:px-8 md:pb-36">
    <div class="mx-auto flex max-w-6xl flex-col gap-20 md:gap-32">
      <SectionsProductFeature
        v-for="(feature, i) in features"
        :key="feature.title"
        :feature="feature"
        :index="i"
        :reverse="(i % 2 === 1) !== reverse"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProductFeature } from "~/types/sections";

withDefaults(
  defineProps<{
    features: ProductFeature[];
    reverse?: boolean;
  }>(),
  { reverse: false },
);
</script>
