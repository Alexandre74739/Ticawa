<template>
  <UiModal v-model="open" :labelledby="titleId">
    <div class="text-center">
      <UiTicoLive mood="neutral" class="mx-auto h-auto w-24" />
      <h2
        :id="titleId"
        class="mt-4 font-display text-xl font-extrabold md:text-2xl"
      >
        C’est fait
        <span
          class="block font-serif text-[1.1em] font-normal text-indigo italic"
        >
          Tico vous dit au revoir
        </span>
      </h2>
      <p class="mt-2.5 text-sm leading-relaxed text-ink/70 md:text-base">
        Votre compte et toutes vos données ont bien été supprimés. Si un jour
        vous revenez, Tico vous gardera une place bien au chaud sur l'app.
      </p>
      <UiButton class="mt-6 max-sm:w-full" @click="open = false">
        Au revoir Tico
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
const open = useState<boolean>("account-deleted", () => false);
const titleId = useId();
</script>
