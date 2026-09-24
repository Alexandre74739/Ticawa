<template>
  <header class="fixed inset-x-0 top-0 z-30 px-3 pt-3 md:px-6 md:pt-5">
    <div
      class="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-ink/15 bg-paper py-2 pr-2 pl-5 shadow-xl shadow-ink/15"
    >
      <NuxtLink
        to="/"
        class="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
      >
        <UiLogo class="h-7 w-auto md:h-8" />
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <Button to="/connexion" variant="ghost">Connexion</Button>

        <div
          class="fixed right-4 z-30 sm:static"
          style="bottom: calc(1rem + env(safe-area-inset-bottom))"
        >
          <Button
            to="/"
            arrow
            class="shadow-xl shadow-ink/25 max-sm:px-8! max-sm:py-3.5! sm:shadow-none"
          >
            <span class="sm:hidden">Obtenir l'app</span>
            <span class="hidden sm:inline">Télécharger l'application</span>
          </Button>
        </div>
      </nav>
    </div>
  </header>
</template>
