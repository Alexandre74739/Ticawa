<template>
  <div>
    <NuxtLink
      to="/dashboard/utilisateurs"
      class="mb-4 inline-flex items-center gap-1.5 rounded-xl py-1 font-display text-sm font-semibold text-indigo hover:underline focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
    >
      <ArrowLeft aria-hidden="true" class="size-4" /> Utilisateurs
    </NuxtLink>

    <DashboardSoon
      v-if="!user"
      title="Cet utilisateur est introuvable"
      mascot="Brouille.svg"
    >
      Son compte a peut-être été supprimé.
    </DashboardSoon>

    <div v-else class="flex flex-col gap-8">
      <DashboardHeading
        :title="`${user.prenom} ${user.nom ?? ''}`.trim() + ','"
        :accent="`inscrit le ${formatDate(user.createdAt.slice(0, 10))}`"
      />

      <AccountCard
        title="Son compte"
        description="Corrigez ses informations si elles bloquent sa connexion ou ses alertes. Chaque changement s'applique tout de suite."
        mascot="Neutre.svg"
      >
        <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <dl :class="panel">
            <div
              v-for="field in infos"
              :key="field.label"
              class="rounded-xl bg-lavender/60 px-3.5 py-3"
            >
              <dt class="text-xs text-ink/55 md:text-sm">{{ field.label }}</dt>
              <dd class="mt-0.5 font-medium">{{ field.value }}</dd>
            </div>
          </dl>

          <form :class="panel" @submit.prevent="save">
            <UiInput v-model="form.prenom" label="Prénom" autocomplete="off" />
            <UiInput
              v-model="form.nom"
              label="Nom"
              autocomplete="off"
              optional
            />
            <UiInput
              v-model="form.email"
              label="Email"
              type="email"
              autocomplete="off"
            />
            <UiToggle
              v-model="form.emailVerified"
              label="Email vérifié"
              description="À activer si le lien de confirmation ne lui parvient pas."
            />
            <UiToggle
              v-model="form.logout"
              label="Déconnecter tous ses appareils"
              description="Utile si un appareil est perdu ou partagé."
            />
            <UiAlert v-if="saveError" tone="danger">{{ saveError }}</UiAlert>
            <UiAlert v-else-if="saved" tone="success"
              >Compte mis à jour.</UiAlert
            >
            <UiButton type="submit" :disabled="saving" class="self-start">
              {{ saving ? "Enregistrement…" : "Enregistrer" }}
            </UiButton>
          </form>
        </div>

        <UiButton variant="danger" class="mt-4" @click="dialog?.open()">
          <Trash2 aria-hidden="true" class="size-4" /> Supprimer ce compte
        </UiButton>
      </AccountCard>

      <section class="flex flex-col gap-4">
        <h2 class="font-display text-2xl font-extrabold">
          Ses tickets
          <span class="text-indigo">({{ user.tickets.total }})</span>
        </h2>
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
          <li v-for="ticket in user.tickets.items" :key="ticket.id">
            <TicketCard :ticket="ticket" />
          </li>
        </ul>
        <p
          v-if="!user.tickets.items.length"
          class="py-6 text-center text-ink/60"
        >
          Aucun ticket{{ search ? ` ne correspond à « ${search} »` : "" }}.
        </p>
        <UiPagination
          :page="page"
          :pages="user.tickets.pages"
          label="Pages de tickets"
        />
      </section>

      <AccountDangerDeleteDialog ref="dialog" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Trash2 } from "@lucide/vue";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const url = `/api/admin/users/${String(route.params.id)}` as const;
const page = computed(() => Math.max(Number(route.query.page) || 1, 1));
const status = computed(() => {
  const value = route.query.status;
  return value === "active" || value === "expired" ? value : undefined;
});
const query = ref("");
const search = ref("");

type TicketFilter = "active" | "expired";
const filters: { label: string; value: TicketFilter | undefined }[] = [
  { label: "Tous", value: undefined },
  { label: "Actifs", value: "active" },
  { label: "Expirés", value: "expired" },
];

const { data: user, refresh } = await useFetch(url, {
  query: { q: search, page, status },
});

useHead({ title: () => user.value?.prenom ?? "Utilisateur" });

const panel =
  "flex flex-col gap-3 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5";

const infos = computed(() => {
  if (!user.value) return [];
  const { password, google, settings } = user.value;
  const channels = [
    settings.channelEmail && "email",
    settings.channelPush && "push",
  ];
  return [
    {
      label: "Connexion",
      value:
        [password && "mot de passe", google && "Google"]
          .filter(Boolean)
          .join(" et ") || "aucune",
    },
    {
      label: "Alertes",
      value: settings.notifications
        ? `activées, par ${channels.filter(Boolean).join(" et ") || "aucun canal"}`
        : "désactivées",
    },
  ];
});

// Rempli une seule fois : changer de page de tickets ne doit pas effacer une saisie.
const form = reactive({
  prenom: user.value?.prenom ?? "",
  nom: user.value?.nom ?? "",
  email: user.value?.email ?? "",
  emailVerified: user.value?.emailVerified ?? false,
  logout: false,
});

const {
  pending: saving,
  error: saveError,
  done: saved,
  execute: save,
} = useAction(async () => {
  await $fetch(url, { method: "PATCH", body: form });
  form.logout = false;
  await refresh();
});

const dialog = ref<{ open: () => void } | null>(null);

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
