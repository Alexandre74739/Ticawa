<template>
  <section
    id="a-propos"
    class="bg-paper px-4 pt-12 pb-24 md:px-8 md:pt-20 md:pb-36"
  >
    <div class="mx-auto max-w-6xl">
      <SectionsAboutStatement :text="statement" :highlight="highlight" />
      <SectionsAboutSteps :steps="steps" class="mt-20 md:mt-32" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AboutStep } from "~/types/sections";

defineProps<{
  statement: string;
  highlight?: string;
  steps: AboutStep[];
}>();
</script>
