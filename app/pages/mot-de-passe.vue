<template>
  <AuthShell
    :title="copy.title"
    :accent="copy.accent"
    :error="form.error.value"
    hide-google
  >
    <div v-if="token && form.done.value" class="space-y-5 text-center">
      <UiTicoLive mood="happy" class="mx-auto h-auto w-28" />
      <UiButton to="/dashboard" arrow class="w-full 2xl:py-3">
        Aller à mon espace
      </UiButton>
    </div>

    <form v-else-if="token" class="space-y-3.5" @submit.prevent="form.execute">
      <UiInput
        v-model="password"
        label="Nouveau mot de passe"
        type="password"
        autocomplete="new-password"
        :minlength="10"
        hint="10 caractères minimum."
      />
      <UiButton
        type="submit"
        class="w-full 2xl:py-3"
        :disabled="form.pending.value"
      >
        {{ form.pending.value ? "Enregistrement…" : "Enregistrer" }}
      </UiButton>
    </form>

    <div v-else class="space-y-3.5">
      <UiAlert v-if="form.done.value" tone="success">
        Si un compte existe pour {{ email }}, un lien vient de partir. Il est
        valable une heure. Pensez à vérifier vos spams.
      </UiAlert>
      <form class="space-y-3.5" @submit.prevent="form.execute">
        <UiInput
          v-model="email"
          label="Email"
          type="email"
          autocomplete="email"
        />
        <UiButton
          type="submit"
          class="w-full 2xl:py-3"
          :disabled="form.pending.value"
        >
          {{ form.pending.value ? "Envoi…" : "Recevoir un lien" }}
        </UiButton>
      </form>
    </div>

    <template #footer>
      <NuxtLink
        :to="loggedIn ? '/compte' : '/connexion'"
        class="font-semibold text-indigo underline-offset-4 hover:underline"
      >
        {{ loggedIn ? "Retour à mon compte" : "Retour à la connexion" }}
      </NuxtLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
useHead({
  title: "Mot de passe",
  meta: [
    { name: "robots", content: "noindex" },
    { name: "referrer", content: "no-referrer" },
  ],
});

const route = useRoute();
const { loggedIn, user, fetch: refreshSession } = useUserSession();

const token = computed(() => String(route.query.token ?? ""));
const password = ref("");
const email = ref(user.value?.email ?? "");

const form = useAction(async () => {
  if (!token.value) {
    await $fetch("/api/auth/password/request", {
      method: "POST",
      body: { email: email.value },
    });
    return;
  }

  await $fetch("/api/auth/password/reset", {
    method: "POST",
    body: { token: token.value, password: password.value },
  });
  await refreshSession();
});

const copy = computed(() =>
  !token.value
    ? { title: "Mot de passe oublié ?", accent: "Tico vous envoie un lien." }
    : form.done.value
      ? { title: "C'est tout bon,", accent: "votre mot de passe est à jour." }
      : { title: "Nouveau mot de passe,", accent: "et c'est reparti." },
);
</script>
