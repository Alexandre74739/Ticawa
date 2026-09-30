<template>
  <div>
    <DashboardHeading title="Historique," accent="les actions des admins" />

    <UiAlert v-if="error" tone="danger">
      Impossible de charger l'historique. Réessayez dans un instant.
    </UiAlert>
    <DashboardSoon
      v-else-if="!data?.total && !search && !kind"
      title="Aucune action pour l'instant"
      mascot="Happy.svg"
    >
      Dès qu'un admin modifie ou supprime des données d'un utilisateur, l'action
      apparaît ici.
    </DashboardSoon>

    <div v-else-if="data" class="flex flex-col gap-4">
      <UiInput
        v-model="query"
        label="Rechercher l'email d'un admin ou d'un utilisateur"
        optional
      />
      <UiFilter
        :model-value="kind"
        label="Filtrer les actions"
        :options="filters"
        @update:model-value="setKind"
      />
      <ul class="flex flex-col gap-3">
        <li v-for="log in data.items" :key="log.id">
          <AdminLogCard :log="log" />
        </li>
      </ul>
      <p v-if="!data.items.length" class="py-6 text-center text-ink/60">
        Aucune action ne correspond{{ search ? ` à « ${search} »` : "" }}.
      </p>

      <UiPagination
        :page="page"
        :pages="data.pages"
        label="Pages de l'historique"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminLogKind } from "#shared/types/adminLog";
import { logFilters as filters } from "~/data/adminLogs";

definePageMeta({ middleware: "admin" });
useHead({ title: "Historique" });

const route = useRoute();
const page = computed(() => Math.max(Number(route.query.page) || 1, 1));
const kind = computed(() => {
  const value = route.query.kind;
  return value === "update" || value === "delete" ? value : undefined;
});
const query = ref("");
const search = ref("");

const { data, error } = await useFetch("/api/admin/logs", {
  query: { q: search, page, kind },
});

function setKind(value: AdminLogKind | undefined) {
  navigateTo({ query: { ...route.query, kind: value, page: undefined } });
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
