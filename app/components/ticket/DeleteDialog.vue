<template>
  <UiModal v-model="open" :labelledby="titleId">
    <div class="text-center">
      <UiTicoLive mood="sad" class="mx-auto h-auto w-20" />
      <h2 :id="titleId" class="mt-4 font-display text-xl font-extrabold">
        Supprimer ce ticket ?
      </h2>
      <p class="mt-2.5 text-sm leading-relaxed text-ink/70">
        La photo et toutes ses informations seront effacées. Si vous jetez
        l'original, vous n'aurez plus de preuve d'achat.
      </p>
    </div>
    <UiAlert v-if="error" tone="danger" class="mt-4">{{ error }}</UiAlert>
    <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
      <UiButton variant="ghost" @click="open = false">Je le garde</UiButton>
      <UiButton :disabled="pending" @click="execute">
        {{ pending ? "Suppression…" : "Je le retire" }}
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
const props = defineProps<{ id: string }>();

const open = ref(false);
const titleId = useId();

const { pending, error, execute } = useAction(async () => {
  await $fetch(`/api/tickets/${props.id}`, { method: "DELETE" });
  open.value = false;
  await navigateTo("/dashboard/tickets");
});

defineExpose({ open: () => (open.value = true) });
</script>
