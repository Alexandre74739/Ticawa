<template>
  <button
    type="button"
    class="flex h-12 shrink-0 items-center gap-3 rounded-2xl border-t border-ink/10 px-4.5 font-display text-sm font-semibold whitespace-nowrap text-ink/60 transition-colors duration-300 hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
  >
    <PanelLeftOpen
      aria-hidden="true"
      class="size-5 shrink-0"
      :class="openClass"
    />
    <PanelLeftClose
      aria-hidden="true"
      class="size-5 shrink-0"
      :class="closeClass"
    />
    <span :class="closeClass">Replier le menu</span>
    <span class="sr-only" :class="openClass">Déplier le menu</span>
  </button>
</template>

<script setup lang="ts">
import { PanelLeftClose, PanelLeftOpen } from "@lucide/vue";

defineProps<{ openClass: string; closeClass: string }>();
</script>
