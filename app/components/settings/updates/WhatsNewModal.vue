<template>
  <UiModal v-if="latest" v-model="open" :labelledby="titleId">
    <div class="text-center">
      <UiTicoLive mood="surprised" class="mx-auto h-auto w-24" />
      <h2
        :id="titleId"
        class="mt-4 font-display text-xl font-extrabold md:text-2xl"
      >
        Quoi de neuf ?
        <span
          class="block text-indigo"
        >
          {{ latest.title }}
        </span>
      </h2>
    </div>
    <ul class="mt-5 space-y-2.5 text-sm leading-relaxed md:text-base">
      <li v-for="item in latest.items" :key="item" class="flex gap-2.5">
        <Sparkles
          aria-hidden="true"
          class="mt-0.5 size-4.5 shrink-0 text-indigo"
        />
        {{ item }}
      </li>
    </ul>
    <UiButton class="mt-6 w-full" @click="open = false">C’est noté</UiButton>
  </UiModal>
</template>

<script setup lang="ts">
import { Sparkles } from "@lucide/vue";

const { latest, open, check } = useWhatsNew();
const { loggedIn } = useUserSession();
const titleId = useId();

onMounted(() => {
  if (loggedIn.value) check();
});
</script>
