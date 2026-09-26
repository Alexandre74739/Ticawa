<template>
  <NuxtLayout>
    <section
      class="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-linear-to-b from-indigo/35 via-lavender to-paper px-4 pt-36 pb-24 text-center md:pt-[calc(4rem+16svh)] md:pb-[6svh]"
    >
      <UiDegrade />
      <SectionsLostTopo />

      <MotionPopIn class="w-36 md:w-[min(12rem,20svh)]">
        <MotionLoop
          :keyframes="{ y: [0, -14, 0], rotate: [-5, 5, -5] }"
          :duration="3.2"
        >
          <SectionsBandeauTico
            :mood="excited ? 'happy' : notFound ? 'confused' : 'dizzy'"
            class="h-auto w-full"
          />
        </MotionLoop>
        <MotionLoop
          :keyframes="{ scaleX: [1, 0.75, 1], opacity: [1, 0.55, 1] }"
          :duration="3.2"
          class="mx-auto mt-4 h-3 w-2/3 rounded-full bg-indigo/25 blur-sm"
        />
      </MotionPopIn>

      <h1
        class="mt-8 font-display text-[clamp(2.4rem,min(6vw,8svh),4.75rem)] leading-[0.95] font-extrabold tracking-tight md:mt-[min(2.5rem,5svh)]"
      >
        <UiRevealText
          :text="
            notFound ? 'Tico a fouillé partout…' : 'Tico a la tête qui tourne…'
          "
          :delay="0.2"
        />
        <span
          class="block font-serif text-[1.12em] font-normal tracking-normal text-indigo italic"
        >
          <UiRevealText
            :text="
              notFound ? 'même sous le canapé' : 'le temps de tout rebrancher'
            "
            :delay="0.45"
          />
        </span>
      </h1>

      <MotionFadeUp
        as="p"
        :delay="0.6"
        class="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/75 md:text-lg"
      >
        <template v-if="notFound">
          Cette page n'existe pas, mais rassurez-vous, c'est bien la seule chose
          d'égarée ici. Vos tickets, eux, sont rangés au chaud.
        </template>
        <template v-else>
          Tico s'est un peu emmêlé les pinceaux. Laissez-lui un instant pour
          remettre de l'ordre, puis réessayez : vos tickets, eux, n'ont pas
          bougé.
        </template>
      </MotionFadeUp>

      <MotionFadeUp :delay="0.7" class="mt-8 md:mt-[min(2.5rem,5svh)]">
        <Button
          size="lg"
          arrow
          class="shadow-xl shadow-indigo/30"
          @click="clearError({ redirect: '/' })"
          @mouseenter="excited = true"
          @mouseleave="excited = false"
        >
          Ramenez-moi à l'accueil
        </Button>
      </MotionFadeUp>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();

const notFound = computed(() => error.status === 404);
const excited = ref(false);

useSeoMeta({
  title: () => (notFound.value ? "Page introuvable" : "Erreur"),
  robots: "noindex",
});
</script>
