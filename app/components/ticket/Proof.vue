<template>
  <SettingsPanel
    :icon="isPdf ? FileText : Image"
    :title="isPdf ? 'Facture PDF' : 'Photo du ticket'"
  >
    <button
      v-if="!isPdf"
      type="button"
      class="block max-h-112 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-lavender focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
      @click="viewer = true"
    >
      <img
        :src="url"
        alt="Photo du ticket de caisse, agrandir"
        loading="lazy"
        class="mx-auto w-full max-w-sm"
      />
    </button>
    <p v-else class="text-sm text-ink/70">
      Document de {{ size }}, conservé tel que vous l'avez importé.
    </p>
    <UiButton :href="`${url}?download=1`" variant="ghost">
      <Download aria-hidden="true" class="size-4" /> Télécharger
    </UiButton>
    <TicketViewer v-model="viewer" :url="url" :pdf="isPdf" />

    <details v-if="rawText" class="group">
      <summary
        class="flex cursor-pointer list-none items-center gap-2 rounded-xl text-sm font-semibold text-indigo focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none [&::-webkit-details-marker]:hidden"
      >
        Texte lu par Tico
        <ChevronDown
          aria-hidden="true"
          class="size-4 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <pre
        class="mt-2 max-h-80 overflow-auto rounded-xl bg-lavender p-3 font-sans text-xs leading-relaxed whitespace-pre-wrap"
        >{{ rawText }}</pre
      >
    </details>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { ChevronDown, Download, Eye, FileText, Image } from "@lucide/vue";

const props = defineProps<{
  id: string;
  file: { type: string; size: number };
  rawText: string | null;
}>();

const viewer = ref(false);
const url = computed(() => `/api/tickets/${props.id}/file`);
const isPdf = computed(() => props.file.type === "application/pdf");
const size = computed(() =>
  props.file.size < 1024 * 1024
    ? `${Math.ceil(props.file.size / 1024)} Ko`
    : `${(props.file.size / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`,
);
</script>
