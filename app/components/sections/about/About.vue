<template>
  <section
    id="a-propos"
    class="bg-paper px-4 pt-12 pb-16 md:px-8 md:pt-20 md:pb-28"
  >
    <div class="mx-auto max-w-6xl">
      <SectionsAboutStatement :text="statement" :highlight="highlight" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  statement: string;
  highlight?: string;
}>();
</script>
