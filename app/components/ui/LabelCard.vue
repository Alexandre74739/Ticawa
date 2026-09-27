<template>
  <div
    class="flex gap-3 rounded-2xl bg-lavender px-4 py-3.5 text-ink [&_p]:leading-relaxed"
  >
    <component
      :is="icon"
      aria-hidden="true"
      class="mt-0.5 size-5 shrink-0 text-indigo"
    />
    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info, ShieldCheck } from "@lucide/vue";

const props = defineProps<{ tone?: "info" | "trust" }>();

const icon = computed(() => (props.tone === "trust" ? ShieldCheck : Info));
</script>
