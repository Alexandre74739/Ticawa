<template>
  <header class="border-b border-ink/10 bg-paper px-4 py-3 md:px-8">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <NuxtLink to="/" class="shrink-0">
        <img
          src="~/assets/logos/Logo-base.svg"
          alt="Ticawa"
          class="h-8 w-auto md:h-9"
        />
      </NuxtLink>

      <nav class="flex items-center gap-3">
        <span class="hidden sm:contents">
          <Button to="/connexion" variant="ghost">Connexion</Button>
        </span>

        <Button
          to="/"
          variant="primary"
          class="fixed right-4 sm:static sm:right-auto"
          style="bottom: calc(1rem + env(safe-area-inset-bottom))"
        >
          Télécharger l'application
          <ChevronRight
            class="h-4 w-4 text-paper transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
          />
        </Button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
</script>
