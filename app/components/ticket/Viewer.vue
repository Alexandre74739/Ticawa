<template>
  <UiModal v-model="open" :labelledby="titleId">
    <h2 :id="titleId" class="font-display text-xl font-extrabold">
      {{ pdf ? "Facture PDF" : "Photo du ticket" }}
    </h2>
    <div
      class="mt-4 flex max-h-[65dvh] flex-col gap-2 overflow-y-auto rounded-2xl bg-lavender p-2"
    >
      <p v-if="loading" class="flex items-center justify-center gap-2 py-10 text-sm text-ink/70">
        <LoaderCircle aria-hidden="true" class="size-5 animate-spin text-indigo" />
        Ouverture du document…
      </p>
      <UiAlert v-else-if="error" tone="danger">{{ error }}</UiAlert>
      <img
        v-for="(src, i) in pages"
        :key="i"
        :src="src"
        :alt="pdf ? `Page ${i + 1} de la facture` : 'Photo du ticket de caisse'"
        class="w-full rounded-xl bg-paper"
      />
    </div>
    <UiButton :href="`${url}?download=1`" class="mt-4 w-full">
      <Download aria-hidden="true" class="size-4" /> Télécharger
    </UiButton>
  </UiModal>
</template>

<script setup lang="ts">
import { Download, LoaderCircle } from "@lucide/vue";

const props = defineProps<{ url: string; pdf: boolean }>();
const open = defineModel<boolean>({ required: true });

const titleId = useId();
const pages = ref<string[]>([]);
const loading = ref(false);
const error = ref("");

async function loadPdf() {
  loading.value = true;
  error.value = "";
  try {
    const file = await $fetch<Blob>(props.url, { responseType: "blob" });
    pages.value = await renderPdfPages(file);
  } catch (e) {
    error.value =
      e instanceof ScanError ? e.message : "Impossible d'afficher ce PDF. Téléchargez-le pour l'ouvrir.";
  } finally {
    loading.value = false;
  }
}

watch(open, (value) => {
  if (!value || pages.value.length) return;
  if (props.pdf) loadPdf();
  else pages.value = [props.url];
});
</script>
