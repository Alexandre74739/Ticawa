<template>
  <AuthShell
    title="Créez votre espace,"
    accent="on garde vos tickets pour vous."
    :error="error"
  >
    <form
      class="space-y-3.5"
      @submit.prevent="submit({ prenom, nom, email, password, cgu })"
    >
      <div class="grid grid-cols-2 gap-3">
        <UiInput v-model="prenom" label="Prénom" autocomplete="given-name" />
        <UiInput v-model="nom" label="Nom" autocomplete="family-name" />
      </div>
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
        autocomplete="new-password"
        :minlength="10"
        hint="10 caractères minimum."
      />

      <label
        class="flex items-start gap-2.5 text-xs leading-relaxed md:text-sm"
      >
        <input
          v-model="cgu"
          type="checkbox"
          required
          class="mt-0.5 size-4 shrink-0 accent-indigo"
        />
        <span>
          J'accepte les
          <NuxtLink
            to="/cgu"
            target="_blank"
            class="font-semibold text-indigo underline underline-offset-4"
            >CGU</NuxtLink
          >
          et la
          <NuxtLink
            to="/confidentialite"
            target="_blank"
            class="font-semibold text-indigo underline underline-offset-4"
            >politique de confidentialité</NuxtLink
          >.
        </span>
      </label>

      <UiButton type="submit" class="w-full 2xl:py-3" :disabled="pending">
        {{ pending ? "Création…" : "Créer mon compte" }}
      </UiButton>
    </form>

    <template #footer>
      Déjà un compte ?
      <NuxtLink
        :to="{ path: '/connexion', query: $route.query }"
        class="font-semibold text-indigo underline-offset-4 hover:underline"
      >
        Se connecter
      </NuxtLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
useHead({ title: "Inscription" });

const prenom = ref("");
const nom = ref("");
const email = ref("");
const password = ref("");
const cgu = ref(false);
const { pending, error, submit } = useAuthForm("/api/auth/register");
</script>
