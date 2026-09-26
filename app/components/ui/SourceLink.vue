<template>
  <a
    :href="source.href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-indigo underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-4 focus-visible:ring-offset-lavender focus-visible:outline-none"
  >
    {{ source.label }}
    <ExternalLink class="size-3 shrink-0" :stroke-width="2.25" />
    <span class="sr-only">(nouvelle fenêtre)</span>
  </a>
</template>

<script setup lang="ts">
import { ExternalLink } from "@lucide/vue";
import type { SourceLink } from "#shared/types/sections";

defineProps<{ source: SourceLink }>();
</script>
