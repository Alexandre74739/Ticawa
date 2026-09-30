<template>
  <SettingsPanel :icon="ShieldCheck" title="Garanties et assurance">
    <ul v-if="rows.length" class="divide-y divide-ink/10">
      <li
        v-for="row in rows"
        :key="row.kind"
        class="space-y-1 py-3 first:pt-0 last:pb-0"
      >
        <div class="flex flex-wrap items-center gap-2">
          <UiBadge :status="coverageStatus[row.state]" />
          <p class="font-display font-bold">{{ row.label }}</p>
        </div>
        <p class="text-sm text-ink/70">
          {{ row.state === "expired" ? "Terminée le" : "Jusqu'au" }}
          {{ row.deadline }}
        </p>
        <p class="text-sm text-ink/75">{{ meanings[row.kind] }}</p>
      </li>
    </ul>
    <p v-else class="text-sm text-ink/75">
      {{
        ticket.legalWarranty === "none"
          ? "Produits du quotidien : pas de garantie à suivre."
          : "Ajoutez la date d'achat pour que Tico calcule les garanties."
      }}
    </p>
    <UiSourceLink
      v-if="ticket.legalWarranty === 'new'"
      :source="legalWarrantySource"
    />
  </SettingsPanel>
</template>

<script setup lang="ts">
import { ShieldCheck } from "@lucide/vue";
import type { Ticket } from "#shared/types/ticket";
import { coverageStatus, legalWarrantySource } from "~/data/ticketFields";

const props = defineProps<{ ticket: Ticket }>();

const meanings = {
  legal:
    "En cas de panne ou de défaut, le magasin doit le réparer ou le remplacer gratuitement.",
  commercial: "Garantie en plus, offerte par le vendeur ou la marque.",
  insurance:
    "En cas de casse ou de vol, déclarez-le à l'assureur avant cette date.",
} as const;

const rows = computed(() =>
  coverages(props.ticket).filter(
    (row): row is typeof row & { kind: keyof typeof meanings } =>
      row.kind !== "return",
  ),
);
</script>
