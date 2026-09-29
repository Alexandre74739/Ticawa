<template>
  <main class="px-3 pt-28 pb-24 md:px-6 md:pt-36 standalone:pt-6">
    <MotionReveal class="mx-auto mt-4 max-w-6xl space-y-6 standalone:mt-0">
      <div class="max-w-3xl pb-4">
        <h1
          class="font-display text-3xl leading-[1.05] font-bold tracking-[-0.02em] text-ink md:text-5xl"
        >
          Mon compte,
          <span
            class="block font-serif text-[1.1em] font-normal tracking-normal text-indigo italic"
          >
            vos données restent les vôtres
          </span>
        </h1>
        <p class="mt-5 text-base leading-relaxed text-ink/75 md:text-lg">
          Vos informations sont bien au chaud avec Tico. a vous d'en faire ce que vous voulez.
        </p>
      </div>

      <UiAlert v-if="error" tone="danger">
        Impossible de charger votre compte. Rechargez la page.
      </UiAlert>

      <template v-else-if="me">
        <AccountHero
          :prenom="me.prenom"
          :nom="me.nom"
          :email="me.email"
          :created-at="me.createdAt"
        />

        <AccountProfileForm
          :prenom="me.prenom"
          :nom="me.nom"
          :email="me.email"
          :has-password="me.password"
        />

        <AccountDataCard />

        <AccountDangerCard />
      </template>
    </MotionReveal>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
useHead({ title: "Mon compte" });

const { data: me, error } = await useFetch("/api/me");
</script>
