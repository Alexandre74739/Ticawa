<template>
  <div
    :role="tone === 'danger' ? 'alert' : 'status'"
    class="flex gap-2.5 rounded-2xl px-4 py-3 text-sm 2xl:text-base"
    :class="
      tone === 'danger'
        ? 'bg-danger/10 text-danger'
        : 'bg-success/10 text-success'
    "
  >
    <component
      :is="tone === 'danger' ? CircleAlert : CircleCheck"
      aria-hidden="true"
      class="mt-0.5 size-4.5 shrink-0"
    />
    <p><slot /></p>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, CircleCheck } from "@lucide/vue";

defineProps<{ tone: "success" | "danger" }>();
</script>
