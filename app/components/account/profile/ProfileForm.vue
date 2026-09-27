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

        <dl class="grid flex-1 gap-3 sm:grid-cols-2 sm:grid-rows-[auto_1fr]">
          <div
            v-for="field in fields"
            :key="field.label"
            :class="[
              field.wide && 'sm:col-span-2',
              'min-w-0 rounded-xl bg-lavender/60 px-3.5 py-3',
            ]"
          >
            <dt
              class="flex items-center gap-1.5 text-xs text-ink/55 md:text-sm"
            >
              <Lock aria-hidden="true" class="size-3.5 shrink-0" />
              {{ field.label }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">{{ field.value }}</dd>
            <dd
              v-if="field.hint"
              class="mt-1 text-xs leading-relaxed text-ink/60 md:text-sm"
            >
              {{ field.hint }}
            </dd>
          </div>
        </dl>
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
import { Lock, UserRound } from "@lucide/vue";

const props = defineProps<{
  prenom: string;
  nom: string | null;
  email: string;
  hasPassword: boolean;
}>();

const panel =
  "flex flex-col gap-3 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5";

const fields = computed(() => [
  { label: "Prénom", value: props.prenom },
  { label: "Nom", value: props.nom || "Non renseigné" },
  {
    label: "Email",
    value: props.email,
    hint: "C’est grâce à lui que Tico vous prévient avant qu’une garantie expire. Il reste le même, pour ne jamais perdre le fil.",
    wide: true,
  },
]);
</script>
