<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap md:text-sm"
    :class="status.class"
  >
    <component :is="status.icon" aria-hidden="true" class="size-3.5 shrink-0" />
    <slot />{{ status.label }}
  </span>
</template>

<script setup lang="ts">
import type { Component } from "vue";

export interface BadgeStatus {
  label: string;
  icon: Component;
  class: string;
}

defineProps<{ status: BadgeStatus }>();
</script>
