<template>
  <div>
    <DashboardHeading
      title="Mes tickets,"
      accent="toutes vos preuves d'achat"
    />

    <UiAlert v-if="error" tone="danger">
      Impossible de charger vos tickets. Réessayez dans un instant.
    </UiAlert>
    <DashboardSoon
      v-else-if="!data?.total && !search && !status"
      title="Aucun ticket pour l'instant"
      mascot="Happy.svg"
    >
      Scannez un ticket de caisse ou importez une facture PDF : Tico le range
      ici et le garde pour vous.
    </DashboardSoon>

    <div v-else-if="data" class="flex flex-col gap-4">
      <UiInput
        v-model="query"
        label="Rechercher un nom, un magasin ou un article"
        optional
      />
      <UiFilter
        :model-value="status"
        label="Filtrer les tickets"
        :options="filters"
        @update:model-value="setStatus"
      />
      <ul class="grid gap-3 lg:grid-cols-2">
        <li v-for="ticket in data.items" :key="ticket.id">
          <TicketCard :ticket="ticket" />
        </li>
      </ul>
      <p v-if="!data.items.length" class="py-6 text-center text-ink/60">
        Aucun ticket ne correspond{{ search ? ` à « ${search} »` : "" }}.
      </p>

      <UiPagination :page="page" :pages="data.pages" label="Pages de tickets" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TicketPage } from "#shared/types/ticket";

useHead({ title: "Mes tickets" });

const route = useRoute();
const page = computed(() => Math.max(Number(route.query.page) || 1, 1));
const status = computed(() => {
  const value = route.query.status;
  return value === "active" || value === "expired" ? value : undefined;
});
const query = ref("");

type TicketFilter = "active" | "expired";
const filters: { label: string; value: TicketFilter | undefined }[] = [
  { label: "Tous", value: undefined },
  { label: "Actifs", value: "active" },
  { label: "Expirés", value: "expired" },
];
const search = ref("");

const { data, error } = await useFetch<TicketPage>("/api/tickets", {
  query: { q: search, page, status },
});

function setStatus(value: TicketFilter | undefined) {
  navigateTo({ query: { ...route.query, status: value, page: undefined } });
}

let timer: ReturnType<typeof setTimeout> | undefined;
watch(query, (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    search.value = value.trim();
    navigateTo({ query: { ...route.query, page: undefined } });
  }, 300);
});
onBeforeUnmount(() => clearTimeout(timer));
</script>
