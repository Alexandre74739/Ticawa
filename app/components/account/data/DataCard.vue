<template>
  <AccountCard
    title="Mes données"
    accent="elles vous appartiennent"
    description="Tico range tout dans un seul fichier, lisible par n’importe quel éditeur de texte. Téléchargez-le quand vous voulez."
    mascot="Perfect.svg"
    :duration="4.6"
    :delay="delay"
  >
    <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <div
        class="flex flex-wrap items-center gap-3 rounded-2xl bg-paper p-3 pr-4 shadow-sm shadow-indigo/10 md:p-4"
      >
        <span
          aria-hidden="true"
          class="grid size-12 shrink-0 place-items-center rounded-xl bg-indigo text-paper"
        >
          <FileJson :stroke-width="1.75" class="size-6" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">{{ fileName }}</p>
          <p class="text-xs text-ink/55 md:text-sm">
            Compte, connexions et historique
          </p>
        </div>
        <UiButton href="/api/me/export" download class="max-sm:w-full">
          <Download aria-hidden="true" class="size-4.5" />
          Télécharger
        </UiButton>
      </div>

      <UiLabelCard tone="trust" class="bg-paper! shadow-sm shadow-indigo/10">
        <p class="text-sm md:text-base">
          Hébergées dans l’Union européenne, jamais revendues. Exportez-les ou
          effacez-les quand vous voulez, sans justification.
          <NuxtLink
            to="/confidentialite"
            class="font-semibold text-indigo underline underline-offset-4"
          >
            En savoir plus
          </NuxtLink>
        </p>
      </UiLabelCard>
    </div>
  </AccountCard>
</template>

<script setup lang="ts">
import { Download, FileJson } from "@lucide/vue";

defineProps<{ delay?: number }>();

const fileName = `ticawa-export-${new Date().toISOString().slice(0, 10)}.json`;
</script>
