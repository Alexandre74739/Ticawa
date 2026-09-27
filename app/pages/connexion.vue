<template>
  <AuthShell
    title="Content de vous revoir,"
    accent="vos droits vous attendent."
    :error="error"
  >
    <form class="space-y-3.5" @submit.prevent="submit({ email, password })">
      <UiInput
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
      />
      <UiInput
        v-model="password"
        label="Mot de passe"
        type="password"
        autocomplete="current-password"
      />
      <p class="-mt-1.5 text-right text-sm">
        <NuxtLink
          to="/mot-de-passe"
          class="font-medium text-indigo underline-offset-4 hover:underline"
        >
          Mot de passe oublié ?
        </NuxtLink>
      </p>
      <UiButton type="submit" class="w-full 2xl:py-3" :disabled="pending">
        {{ pending ? "Connexion…" : "Se connecter" }}
      </UiButton>
    </form>

    <template #footer>
      Pas encore de compte ?
      <NuxtLink
        :to="{ path: '/inscription', query: $route.query }"
        class="font-semibold text-indigo underline-offset-4 hover:underline"
      >
        Créer mon espace
      </NuxtLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
useHead({ title: "Connexion" });

const email = ref("");
const password = ref("");
const { pending, error, submit } = useAuthForm("/api/auth/login");
</script>
