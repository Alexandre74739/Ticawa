<template>
  <div>
    <h3 class="flex items-center gap-2.5 font-display text-lg font-bold">
      <KeyRound aria-hidden="true" class="size-5 text-indigo" />
      Mot de passe
    </h3>
    <p class="text-sm leading-relaxed text-ink/70 md:text-base">
      {{
        hasPassword
          ? "Pas besoin de l’ancien : Tico vous envoie un lien, valable une heure et à usage unique."
          : "Vous vous connectez avec Google. Ajoutez un mot de passe pour pouvoir vous connecter des deux façons."
      }}
    </p>

    <ol class="my-auto grid grid-cols-3 gap-2 py-3">
      <li
        v-for="(step, i) in steps"
        :key="step.label"
        class="relative flex flex-col items-center gap-2 text-center"
      >
        <span
          v-if="i"
          aria-hidden="true"
          class="absolute top-5 right-1/2 w-full border-t-2 border-dashed border-indigo/25"
        />
        <span
          class="relative grid size-10 place-items-center rounded-full transition-colors duration-300"
          :class="
            done && i === 0
              ? 'bg-success text-paper'
              : 'bg-lavender text-indigo'
          "
        >
          <component
            :is="done && i === 0 ? Check : step.icon"
            aria-hidden="true"
            class="size-5"
          />
        </span>
        <span class="text-xs leading-snug text-ink/70 md:text-sm">
          {{ step.label }}
        </span>
      </li>
    </ol>

    <UiAlert v-if="error" tone="danger">{{ error }}</UiAlert>
    <UiAlert v-else-if="done" tone="success">
      Lien envoyé à {{ email }}. Pensez à vérifier vos spams.
    </UiAlert>

    <UiButton
      :disabled="pending"
      class="mt-auto self-start max-sm:w-full"
      @click="execute"
    >
      <Mail aria-hidden="true" class="size-4.5" />
      {{
        pending
          ? "Envoi…"
          : hasPassword
            ? "Changer mon mot de passe"
            : "Définir un mot de passe"
      }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import {
  Check,
  KeyRound,
  Mail,
  MousePointerClick,
  ShieldCheck,
} from "@lucide/vue";

const props = defineProps<{ email: string; hasPassword: boolean }>();

// Le parcours du lien, en trois temps. La 1re étape se coche une fois le mail parti.
const steps = computed(() => [
  { icon: Mail, label: "Tico vous envoie un lien" },
  { icon: MousePointerClick, label: "Vous l’ouvrez" },
  {
    icon: ShieldCheck,
    label: props.hasPassword
      ? "Vous choisissez le nouveau"
      : "Vous créez le vôtre",
  },
]);

const { pending, error, done, execute } = useAction(async () => {
  await $fetch("/api/auth/password/request", { method: "POST" });
});
</script>
