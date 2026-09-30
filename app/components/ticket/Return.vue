<template>
  <SettingsPanel :icon="RefreshCcw" title="Échange ou remboursement">
    <template v-if="deadline">
      <div class="flex flex-wrap items-center gap-2">
        <UiBadge :status="coverageStatus[deadline.state]" />
        <p class="font-display font-bold">{{ headline }}</p>
      </div>
      <p class="text-sm text-ink/70">
        D'après le ticket : {{ ticket.returnDays }} jours après l'achat, soit
        jusqu'au {{ deadline.deadline }} environ.
      </p>
      <blockquote
        v-if="ticket.returnPolicy"
        class="rounded-2xl bg-lavender px-4 py-3 text-sm text-ink/80 italic"
      >
        « {{ ticket.returnPolicy }} »
      </blockquote>
    </template>

    <div v-else class="space-y-2 text-sm text-ink/75">
      <p>
        Aucun délai d'échange n'est imprimé sur ce ticket. En magasin, reprendre
        un article qui fonctionne n'est pas une obligation : c'est un geste
        commercial, propre à chaque enseigne.
      </p>
      <p>
        Achat en ligne ? Vous avez en principe 14 jours après la réception pour
        changer d'avis.
      </p>
      <UiSourceLink :source="withdrawalSource" />
    </div>

    <UiLabelCard tone="trust">
      <p class="font-display font-bold">À présenter au magasin</p>
      <ul class="list-disc space-y-1 pl-4 text-sm text-ink/80">
        <li v-for="line in bring" :key="line">{{ line }}</li>
      </ul>
    </UiLabelCard>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { RefreshCcw } from "@lucide/vue";
import type { Ticket } from "#shared/types/ticket";
import { coverageStatus, withdrawalSource } from "~/data/ticketFields";

const props = defineProps<{ ticket: Ticket }>();

const deadline = computed(() => returnWindow(props.ticket));

const headline = computed(() => {
  const days = deadline.value?.daysLeft ?? 0;
  if (days < 0)
    return `Délai dépassé depuis ${-days} jour${days < -1 ? "s" : ""}`;
  if (days === 0) return "Dernier jour pour l'échanger";
  return `Encore ${days} jour${days > 1 ? "s" : ""} pour l'échanger`;
});

const bring = computed(() => {
  const { source, paymentMethod, cardLast4, ticketNumber } = props.ticket;
  const doc = source === "pdf" ? "facture" : "ticket";
  const card = cardLast4 ? ` (carte finissant par ${cardLast4})` : "";
  return [
    `Ce ${doc}, ouvert dans Ticawa ou téléchargé`,
    `Le moyen de paiement utilisé${paymentMethod ? ` : ${paymentMethod.toLowerCase()}` : ""}${card}`,
    ...(ticketNumber ? [`Le n° de ${doc} : ${ticketNumber}`] : []),
    "L'article, si possible dans son emballage d'origine",
  ];
});
</script>
