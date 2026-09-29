<template>
  <li>
    <NuxtLink
      :to="link.to"
      :title="link.label"
      :active-class="link.exact ? '' : 'is-active'"
      exact-active-class="is-active"
      :class="[item, { 'hidden standalone:flex': link.installedOnly }]"
    >
      <component :is="link.icon" aria-hidden="true" class="size-5 shrink-0" />
      <span :class="labelClass">{{ link.label }}</span>
    </NuxtLink>

    <button
      v-if="link.installedOnly"
      type="button"
      :title="`${link.label} : disponible dans l'app installée`"
      :class="[item, 'w-full standalone:hidden']"
      @click="install"
    >
      <span class="relative flex shrink-0">
        <component
          :is="link.icon"
          aria-hidden="true"
          class="size-5 opacity-60"
        />
        <Lock
          aria-hidden="true"
          class="absolute -right-1.5 -bottom-1 size-3 rounded-full bg-lavender text-terracotta"
        />
      </span>
      <span
        :class="labelClass"
        class="flex flex-1 items-center justify-between gap-2"
      >
        <span class="opacity-60">{{ link.label }}</span>
        <span
          class="rounded-full bg-terracotta/15 px-2 py-0.5 text-xs text-terracotta"
        >
          App
        </span>
      </span>
    </button>
  </li>
</template>

<script setup lang="ts">
import { Lock } from "@lucide/vue";
import type { DashboardLink } from "~/data/dashboard";

defineProps<{ link: DashboardLink; labelClass: string }>();

const { install } = usePwaInstall();

const item =
  "flex h-12 items-center gap-3 rounded-2xl px-4.5 text-left font-display font-semibold whitespace-nowrap text-ink/75 transition-colors duration-300 hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo [&.is-active]:bg-indigo [&.is-active]:text-paper";
</script>
