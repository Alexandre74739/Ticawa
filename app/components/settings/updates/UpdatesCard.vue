<template>
  <AccountCard
    title="Mises à jour"
    accent="Tico apprend de nouveaux tours"
    description="Ticawa se met à jour tout seul, sans rien vous demander. Vous pouvez choisir d’être prévenu de ce qui change."
    mascot="Surprised.svg"
    :duration="4.3"
  >
    <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <div :class="panel">
        <h3 class="flex items-center gap-2.5 font-display text-lg font-bold">
          <Sparkles aria-hidden="true" class="size-5 text-indigo" />
          Nouveautés
        </h3>
        <UiToggle
          :model-value="showUpdates"
          label="Afficher les nouveautés après une mise à jour"
          description="Réglage propre à cet appareil."
          @update:model-value="setShowUpdates"
        />
      </div>

      <div v-if="latest" :class="panel">
        <p class="text-xs text-ink/55 md:text-sm">
          Dernière nouveauté · {{ formatDate(latest.date) }}
        </p>
        <p class="font-display text-lg font-bold">{{ latest.title }}</p>
        <UiButton
          variant="light"
          class="mt-auto self-start"
          @click="open = true"
        >
          <Eye aria-hidden="true" class="size-4.5" />
          Revoir les nouveautés
        </UiButton>
      </div>
    </div>
  </AccountCard>
</template>

<script setup lang="ts">
import { Eye, Sparkles } from "@lucide/vue";

const panel =
  "flex flex-col gap-3 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5";

const { latest, showUpdates, open, load, setShowUpdates } = useWhatsNew();

onMounted(load);

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(date),
  );
}
</script>
