<template>
  <div
    role="status"
    aria-live="polite"
    class="flex flex-col items-center gap-5 rounded-4xl bg-lavender px-6 py-10 text-center"
  >
    <UiTicoLive mood="neutral" class="h-auto w-24" />
    <div>
      <p class="font-display text-xl font-extrabold">
        Tico lit votre
        <span class="text-indigo">ticket</span>
      </p>
      <p class="mt-1 text-sm text-ink/70">
        Gardez l'app ouverte, ça prend quelques secondes.
      </p>
    </div>

    <ol class="flex w-full max-w-xs flex-col gap-2.5 text-left">
      <li
        v-for="(item, i) in steps"
        :key="item.key"
        class="flex items-center gap-3 text-sm font-medium"
        :class="i > current ? 'text-ink/45' : 'text-ink'"
      >
        <CircleCheck
          v-if="i < current"
          aria-hidden="true"
          class="size-5 text-indigo"
        />
        <LoaderCircle
          v-else-if="i === current"
          aria-hidden="true"
          class="size-5 animate-spin text-indigo"
        />
        <Circle v-else aria-hidden="true" class="size-5" />
        {{ item.label }}
      </li>
    </ol>

    <div
      v-if="step === 'read'"
      class="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-paper"
    >
      <div
        class="h-full rounded-full bg-indigo transition-[width] duration-300"
        :style="{ width: `${Math.max(6, progress * 100)}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Circle, CircleCheck, LoaderCircle } from "@lucide/vue";
import type { ScanStep } from "~/composables/useScan";

const props = defineProps<{ step: ScanStep; progress: number }>();

const steps = [
  { key: "prepare", label: "Préparation de la photo" },
  { key: "read", label: "Lecture des informations" },
  { key: "save", label: "Rangement dans vos tickets" },
];
const current = computed(() => steps.findIndex((s) => s.key === props.step));
</script>
