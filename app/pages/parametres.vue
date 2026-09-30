<template>
  <main class="px-3 pt-28 pb-24 md:px-6 md:pt-36 standalone:pt-6">
    <MotionReveal class="mx-auto mt-4 max-w-6xl space-y-6 standalone:mt-0">
      <div class="max-w-3xl pb-4">
        <h1
          class="font-display text-3xl leading-[1.05] font-bold tracking-[-0.02em] text-ink md:text-5xl"
        >
          Mes paramètres,
          <span
            class="block text-indigo"
          >
            Tico s’adapte à vous
          </span>
        </h1>
        <p class="mt-5 text-base leading-relaxed text-ink/75 md:text-lg">
          Choisissez comment Tico vous prévient, et gardez un œil sur ce que
          vous lui autorisez.
        </p>
      </div>

      <SettingsNotificationsCard />

      <SettingsUpdatesCard />

      <!-- Les autorisations concernent l'appareil : téléphone uniquement. -->
      <ClientOnly>
        <SettingsPermissionsCard v-if="!isDesktop" />
      </ClientOnly>
    </MotionReveal>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
useHead({ title: "Paramètres" });

const { isDesktop } = useDevice();
</script>
