<template>
  <nav
    v-if="loggedIn"
    aria-label="Navigation principale"
    class="fixed inset-x-0 bottom-0 z-30 hidden px-3 standalone:block"
    style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom))"
  >
    <ul
      class="mx-auto flex max-w-md items-center gap-1 rounded-3xl border border-ink/15 bg-paper p-1.5 shadow-xl shadow-ink/15"
    >
      <li v-for="tab in tabs" :key="tab.to" class="flex-1">
        <NuxtLink
          :to="tab.to"
          class="flex flex-col items-center gap-0.5 rounded-2xl py-2 font-display text-xs font-semibold text-ink/70 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo [&.router-link-active]:bg-indigo [&.router-link-active]:text-paper"
        >
          <component :is="tab.icon" aria-hidden="true" class="size-5.5" />
          {{ tab.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { House, LayoutDashboard, Settings, UserRound } from "@lucide/vue";

const { loggedIn } = useUserSession();

const tabs = [
  { label: "Accueil", to: "/", icon: House },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Compte", to: "/compte", icon: UserRound },
  { label: "Paramètres", to: "/parametres", icon: Settings },
];
</script>
