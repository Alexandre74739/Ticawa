<template>
  <AccountCard
    title="Mes informations"
    accent="Tico n’est pas curieux"
    description="Votre prénom pour vous dire bonjour, votre email pour vous relancer avant qu’une garantie ne file à l’anglaise. Promis, il n’en demande pas plus."
    mascot="Neutre.svg"
  >
    <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <div :class="panel">
        <h3 class="flex items-center gap-2.5 font-display text-lg font-bold">
          <UserRound aria-hidden="true" class="size-5 text-indigo" />
          Identité
        </h3>

        <form class="flex flex-col gap-3" @submit.prevent="profile.execute">
          <div class="grid gap-3 sm:grid-cols-2">
            <UiInput
              v-model="prenom"
              label="Prénom"
              autocomplete="given-name"
            />
            <UiInput
              v-model="nom"
              label="Nom"
              autocomplete="family-name"
              optional
            />
          </div>
          <UiAlert v-if="profile.error.value" tone="danger">
            {{ profile.error.value }}
          </UiAlert>
          <UiButton
            v-if="changed"
            type="submit"
            class="self-start"
            :disabled="profile.pending.value"
          >
            {{ profile.pending.value ? "Enregistrement…" : "Enregistrer" }}
          </UiButton>
          <p v-else-if="profile.done.value" :class="status" role="status">
            C’est enregistré.
          </p>
        </form>

        <form
          class="space-y-2 rounded-xl bg-lavender/60 px-3.5 py-3"
          @submit.prevent="request.execute"
        >
          <p class="text-xs text-ink/55 md:text-sm">Email</p>
          <p class="truncate font-medium">{{ email }}</p>
          <template v-if="editing">
            <UiInput
              v-model="newEmail"
              label="Nouvelle adresse"
              type="email"
              autocomplete="email"
            />
            <UiButton type="submit" :disabled="request.pending.value">
              {{
                request.pending.value
                  ? "Envoi…"
                  : "Recevoir le lien de confirmation"
              }}
            </UiButton>
          </template>
          <p v-else-if="message" :class="status" role="status">{{ message }}</p>
          <UiButton v-else @click="editing = true">Changer d’adresse</UiButton>
          <UiAlert
            v-if="request.error.value || confirm.error.value"
            tone="danger"
          >
            {{ request.error.value || confirm.error.value }}
          </UiAlert>
        </form>
      </div>

      <AccountProfilePasswordPanel
        :class="panel"
        :email="email"
        :has-password="hasPassword"
      />
    </div>
  </AccountCard>
</template>

<script setup lang="ts">
import { UserRound } from "@lucide/vue";

type Profile = { prenom?: string; nom?: string | null; email?: string };

const props = defineProps<{
  prenom: string;
  nom: string | null;
  email: string;
  hasPassword: boolean;
}>();
const emit = defineEmits<{ saved: [profile: Profile] }>();

const panel =
  "flex flex-col gap-3 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5";
const status = "text-sm text-ink/70";

const prenom = ref(props.prenom);
const nom = ref(props.nom ?? "");
const changed = computed(
  () =>
    prenom.value.trim() !== props.prenom ||
    nom.value.trim() !== (props.nom ?? ""),
);

const { fetch: refreshSession } = useUserSession();
async function save(url: string, body: object) {
  const saved = await $fetch<Profile>(url, {
    method: url === "/api/me" ? "PATCH" : "POST",
    body,
  });
  emit("saved", saved);
  await refreshSession();
  return saved;
}

const profile = useAction(() =>
  save("/api/me", { prenom: prenom.value, nom: nom.value }),
);

const editing = ref(false);
const newEmail = ref("");
const message = ref("");
const request = useAction(async () => {
  await $fetch("/api/me/email", {
    method: "POST",
    body: { email: newEmail.value },
  });
  editing.value = false;
  message.value = `Lien envoyé à ${newEmail.value.trim()} : ouvrez-le dans l’heure pour confirmer.`;
});

// Retour depuis le lien de confirmation (/compte?email=…).
const route = useRoute();
const confirm = useAction(async () => {
  const { email } = await save("/api/me/email/confirm", {
    token: route.query.email,
  });
  message.value = `C’est fait : Ticawa utilise désormais ${email}.`;
});
onMounted(async () => {
  if (typeof route.query.email !== "string") return;
  await confirm.execute();
  navigateTo({ query: {} }, { replace: true });
});
</script>
