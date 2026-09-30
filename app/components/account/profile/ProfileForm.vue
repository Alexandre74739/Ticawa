<template>
  <AccountCard
    title="Mes informations"
    accent="Tico n’est pas curieux"
    description="Votre prénom pour vous dire bonjour, votre email pour vous relancer avant qu’une garantie ne file à l’anglaise. Promis, il n’en demande pas plus."
    mascot="Neutre.svg"
  >
    <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <form :class="panel" @submit.prevent="execute">
        <h3 class="flex items-center gap-2.5 font-display text-lg font-bold">
          <UserRound aria-hidden="true" class="size-5 text-indigo" />
          Identité
        </h3>

        <div class="grid gap-3 sm:grid-cols-2">
          <UiInput v-model="prenom" label="Prénom" autocomplete="given-name" />
          <UiInput v-model="nom" label="Nom" autocomplete="family-name" optional />
          <div class="min-w-0 rounded-xl bg-lavender/60 px-3.5 py-3 sm:col-span-2">
            <p class="flex items-center gap-1.5 text-xs text-ink/55 md:text-sm">
              <Lock aria-hidden="true" class="size-3.5 shrink-0" />
              Email
            </p>
            <p class="mt-0.5 truncate font-medium">{{ email }}</p>
            <p class="mt-1 text-xs leading-relaxed text-ink/60 md:text-sm">
              C’est grâce à lui que Tico vous prévient avant qu’une garantie
              expire. Il reste le même, pour ne jamais perdre le fil.
            </p>
          </div>
        </div>

        <UiAlert v-if="error" tone="danger">{{ error }}</UiAlert>
        <p v-else-if="done && !changed" class="text-sm text-ink/70" role="status">
          C’est enregistré.
        </p>
        <UiButton v-if="changed" type="submit" class="self-start" :disabled="pending">
          {{ pending ? "Enregistrement…" : "Enregistrer" }}
        </UiButton>
      </form>

      <AccountProfilePasswordPanel
        :class="panel"
        :email="email"
        :has-password="hasPassword"
      />
    </div>
  </AccountCard>
</template>

<script setup lang="ts">
import { Lock, UserRound } from "@lucide/vue";

const props = defineProps<{
  prenom: string;
  nom: string | null;
  email: string;
  hasPassword: boolean;
}>();
const emit = defineEmits<{ saved: [profile: { prenom: string; nom: string | null }] }>();

const prenom = ref(props.prenom);
const nom = ref(props.nom ?? "");
const changed = computed(
  () => prenom.value.trim() !== props.prenom || nom.value.trim() !== (props.nom ?? ""),
);

const { fetch: refreshSession } = useUserSession();
const { pending, error, done, execute } = useAction(async () => {
  const saved = await $fetch<{ prenom: string; nom: string | null }>("/api/me", {
    method: "PATCH",
    body: { prenom: prenom.value, nom: nom.value },
  });
  emit("saved", saved);
  await refreshSession();
});

const panel =
  "flex flex-col gap-3 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5";
</script>
