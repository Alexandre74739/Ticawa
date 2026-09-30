<template>
  <div>
    <DashboardHeading
      title="Utilisateurs,"
      accent="les comptes de la plateforme"
    />

    <UiAlert v-if="error" tone="danger">
      Impossible de charger les utilisateurs. Réessayez dans un instant.
    </UiAlert>
    <DashboardSoon
      v-else-if="!data?.total && !search"
      title="Aucun utilisateur pour l'instant"
      mascot="Happy.svg"
    >
      Les comptes apparaîtront ici dès les premières inscriptions.
    </DashboardSoon>

    <div v-else-if="data" class="flex flex-col gap-4">
      <UiLabelCard tone="trust">
        <p>
          RGPD : chaque consultation ou modification d'un compte par un admin
          doit rester traçable.
        </p>
        <NuxtLink
          to="/dashboard/historique"
          class="inline-flex rounded font-display font-semibold text-indigo hover:underline focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
        >
          Voir l'historique des actions admin
        </NuxtLink>
      </UiLabelCard>
      <UiInput
        v-model="query"
        label="Rechercher un prénom, un nom ou un email"
        optional
      />
      <ul class="grid gap-3 lg:grid-cols-2">
        <li v-for="user in data.items" :key="user.id">
          <NuxtLink
            :to="`/dashboard/utilisateurs/${user.id}`"
            class="flex items-center gap-4 rounded-3xl bg-lavender p-4 transition-colors duration-300 hover:bg-indigo/15 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
          >
            <span
              class="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper font-display text-lg font-bold text-indigo shadow-sm shadow-indigo/10"
            >
              {{ user.prenom.charAt(0).toUpperCase() }}
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate font-display text-lg font-bold">
                  {{ user.prenom }} {{ user.nom }}
                </span>
                <span class="shrink-0 font-display font-bold text-indigo">
                  {{ user.ticketCount }} ticket{{
                    user.ticketCount > 1 ? "s" : ""
                  }}
                </span>
              </span>
              <span class="block truncate text-sm text-ink/65">
                {{ user.email }} · inscrit le
                {{ formatDate(user.createdAt.slice(0, 10), "short") }}
              </span>
            </span>
          </NuxtLink>
        </li>
      </ul>
      <p v-if="!data.items.length" class="py-6 text-center text-ink/60">
        Aucun utilisateur ne correspond à « {{ search }} ».
      </p>

      <UiPagination
        :page="page"
        :pages="data.pages"
        label="Pages d'utilisateurs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin" });
useHead({ title: "Utilisateurs" });

const route = useRoute();
const page = computed(() => Math.max(Number(route.query.page) || 1, 1));
const query = ref("");
const search = ref("");

const { data, error } = await useFetch("/api/admin/users", {
  query: { q: search, page },
});

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
