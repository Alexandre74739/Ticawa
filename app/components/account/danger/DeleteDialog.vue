<template>
  <UiModal v-model="open" :labelledby="titleId">
    <div class="text-center">
      <UiTicoLive
        :mood="staying ? 'happy' : 'sad'"
        class="mx-auto h-auto w-24"
      />
      <h2
        :id="titleId"
        class="mt-4 font-display text-xl font-extrabold md:text-2xl"
      >
        {{ user ? `Supprimer le compte de ${user.prenom} ?` : "Vous partez déjà ?" }}
      </h2>
      <p class="mt-2.5 text-sm leading-relaxed text-ink/70 md:text-base">
        <template v-if="user">
          Tico va tout oublier : ses tickets, ses garanties, ses alertes. Rien
          ne pourra être récupéré.
        </template>
        <template v-else>
          Tico va tout oublier : vos tickets, vos garanties, vos alertes. Il ne
          pourra plus veiller sur vos droits, et rien ne pourra être récupéré.
        </template>
      </p>
    </div>

    <form class="mt-6 space-y-4" @submit.prevent="execute">
      <p class="text-center text-sm font-medium md:text-base">
        Pour confirmer, tapez
        <span
          class="mx-0.5 rounded-lg bg-lavender px-2 py-0.5 font-display font-bold tracking-wide text-indigo"
          >SUPPRIMER</span
        >
        ci-dessous.
      </p>
      <UiInput
        v-model="confirmation"
        label="Mot de confirmation"
        autocomplete="off"
      />

      <UiAlert v-if="error" tone="danger">{{ error }}</UiAlert>

      <div
        class="flex flex-col-reverse items-center justify-center gap-3 sm:flex-row"
      >
        <UiButton
          variant="ghost"
          class="max-sm:w-full"
          @click="open = false"
          @mouseenter="staying = true"
          @mouseleave="staying = false"
          @focus="staying = true"
          @blur="staying = false"
        >
          Annuler
        </UiButton>
        <UiButton
          type="submit"
          variant="primary"
          class="max-sm:w-full"
          :disabled="pending || !ready"
        >
          {{ pending ? "Suppression…" : user ? "Supprimer ce compte" : "Supprimer mon compte" }}
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
// Sans `user` : l'utilisateur supprime son propre compte. Avec : un admin
// supprime ce compte depuis la page Utilisateurs.
const props = defineProps<{ user?: { id: string; prenom: string } }>();

const DELETE_WORD = "SUPPRIMER";

const open = ref(false);
const titleId = useId();
const confirmation = ref("");
const staying = ref(false);
const ready = computed(
  () => confirmation.value.trim().toUpperCase() === DELETE_WORD,
);

const { fetch: refreshSession } = useUserSession();
// Partagé avec AccountDangerGoodbyeModal via la clé useState.
const accountDeleted = useState<boolean>("account-deleted", () => false);
const { pending, error, execute } = useAction(async () => {
  if (props.user) {
    await $fetch(`/api/admin/users/${props.user.id}`, { method: "DELETE" });
    open.value = false;
    return navigateTo("/dashboard/utilisateurs");
  }
  await $fetch("/api/me", {
    method: "DELETE",
    body: { confirmation: confirmation.value.trim() },
  });
  open.value = false;
  await refreshSession();
  await navigateTo("/");
  accountDeleted.value = true;
});

watch(open, (value) => {
  if (value) return;
  confirmation.value = "";
  error.value = "";
  staying.value = false;
});

defineExpose({ open: () => (open.value = true) });
</script>
