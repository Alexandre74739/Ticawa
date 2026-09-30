<template>
  <div
    class="rounded-4xl bg-terracotta/10 p-6 shadow-lg shadow-terracotta/15 md:p-8"
    @mouseenter="worried = true"
    @mouseleave="worried = false"
  >
    <div
      class="flex flex-col items-center gap-5 text-center md:flex-row md:gap-8 md:text-left"
    >
      <MotionLoop
        :keyframes="{ y: [0, -6, 0], rotate: [-4, 3, -4] }"
        :duration="4.8"
        class="w-20 shrink-0 md:w-24"
      >
        <UiTicoLive :mood="worried ? 'sad' : 'neutral'" class="h-auto w-full" />
      </MotionLoop>

      <div class="min-w-0 flex-1">
        <h2 class="font-display text-xl leading-tight font-bold md:text-2xl">
          Supprimer mon compte
          <span
            class="block text-terracotta"
          >
            Tico en aurait gros sur le cœur
          </span>
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink/70 md:text-base">
          Votre compte et tout ce qu’il contient sont effacés de notre base,
          sans retour possible. Exportez vos données avant si vous voulez en
          garder une trace.
        </p>
      </div>

      <UiButton
        variant="danger"
        class="shrink-0 max-md:w-full"
        @click="dialog?.open()"
      >
        <Trash2 aria-hidden="true" class="size-4.5" />
        Supprimer mon compte
      </UiButton>
    </div>

    <AccountDangerDeleteDialog ref="dialog" />
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from "@lucide/vue";

const dialog = ref<{ open: () => void } | null>(null);
const worried = ref(false);
</script>
