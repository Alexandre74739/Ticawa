<template>
  <div
    class="flex flex-col gap-4 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5"
  >
    <h3 class="flex items-center gap-2.5 font-display text-lg font-bold">
      <component :is="icon" aria-hidden="true" class="size-5 text-indigo" />
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{ icon: Component; title: string }>();
</script>
