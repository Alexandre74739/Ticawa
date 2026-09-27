<template>
  <footer class="relative isolate overflow-hidden bg-indigo text-paper">
    <LayoutFooterDecor />
    <LayoutFooterWave />

    <div
      class="relative mx-auto max-w-6xl px-4 pt-6 pb-28 sm:pb-8 md:px-8 md:pt-8"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-4 top-4 bottom-6 -z-10 select-none sm:left-1/2 md:right-8 lg:left-1/3"
      >
        <BrandLogo
          tone="paper"
          preserveAspectRatio="xMaxYMax meet"
          class="size-full opacity-[0.07]"
        />
      </div>

      <div
        class="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <NuxtLink
            to="/"
            class="inline-block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-4 focus-visible:ring-offset-indigo"
          >
            <BrandLogo tone="paper" class="h-10 w-auto md:h-12" />
          </NuxtLink>
          <p
            class="mt-4 font-display text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-3xl"
          >
            Perdez votre ticket,
            <span
              class="block font-serif text-[1.1em] font-normal tracking-normal text-lavender italic"
            >
              jamais vos droits.
            </span>
          </p>
        </div>

        <div class="hidden shrink-0 sm:block standalone:hidden!">
          <UiButton
            variant="light"
            arrow
            size="lg"
            class="shadow-xl shadow-ink/25"
            @click="install"
          >
            Installer l'application
          </UiButton>
        </div>
      </div>

      <div
        class="mt-6 flex flex-col gap-2 border-t border-paper/20 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between md:mt-8"
      >
        <nav aria-label="Liens légaux">
          <ul class="flex flex-wrap gap-x-6">
            <li v-for="link in legal" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="relative inline-block rounded py-1 text-paper/80 transition-colors after:absolute after:bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-paper after:transition-[width] after:duration-300 hover:text-paper hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <p class="text-xs text-paper/60">© {{ year }} Ticawa</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { install } = usePwaInstall();

const legal = [
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Confidentialité", to: "/confidentialite" },
  { label: "CGU", to: "/cgu" },
];

const year = new Date().getFullYear();
</script>
