<template>
  <section
    class="relative isolate flex flex-col overflow-hidden rounded-[2rem] p-6 md:p-8"
    :class="
      indigo
        ? 'bg-indigo text-paper shadow-2xl shadow-indigo/35'
        : 'bg-paper shadow-lg ring-1 shadow-indigo/10 ring-indigo/10'
    "
  >
    <LandingCtaDecor v-if="indigo" />

    <h2
      class="font-display leading-[1.05] font-extrabold tracking-[-0.02em]"
      :class="indigo ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'"
    >
      {{ title }}
    </h2>
    <p
      v-if="text || (rows && !rows.length)"
      class="mt-1.5 max-w-xl leading-relaxed"
      :class="indigo ? 'text-paper/90 md:text-lg' : 'text-ink/65'"
    >
      {{ text || empty }}
    </p>

    <ul
      v-if="rows?.length"
      class="flex flex-col"
      :class="indigo ? 'mt-6 border-t border-paper/15 pt-4' : 'mt-4'"
    >
      <li v-for="row in rows" :key="row.key ?? row.id">
        <NuxtLink
          :to="`/dashboard/tickets/${row.id}`"
          class="-mx-3 flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none"
          :class="
            indigo
              ? 'hover:bg-paper/10 focus-visible:ring-paper'
              : 'hover:bg-lavender/60 focus-visible:ring-indigo'
          "
        >
          <span
            v-if="row.mascot"
            class="grid size-9 shrink-0 place-items-center rounded-xl bg-paper shadow-sm shadow-indigo/15"
          >
            <img :src="`/mascotte/${row.mascot}.svg`" alt="" class="w-5" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate font-display font-bold">
              {{ row.title }}
            </span>
            <span
              class="block text-sm"
              :class="indigo ? 'text-paper/70' : 'text-ink/60'"
            >
              {{ row.meta }}
            </span>
          </span>
          <span
            class="shrink-0 font-display font-bold"
            :class="indigo ? 'text-lavender' : 'text-indigo'"
          >
            {{ row.value }}
          </span>
        </NuxtLink>
      </li>
    </ul>

    <slot />

    <div v-if="actions?.length" class="mt-auto flex flex-wrap gap-3 pt-6">
      <UiButton
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        :variant="indigo ? 'light' : 'ghost'"
        arrow
        :class="[visibility[action.only ?? 'all'], !indigo && '-ml-4']"
      >
        {{ action.label }}
      </UiButton>
    </div>
    <slot name="footer" />
  </section>
</template>

<script setup lang="ts">
import type { OverviewAction, OverviewRow } from "~/composables/useOverview";

defineProps<{
  title: string;
  text?: string;
  indigo?: boolean;
  rows?: OverviewRow[];
  empty?: string;
  actions?: OverviewAction[];
}>();

const visibility = {
  all: "",
  installed: "hidden! standalone:inline-flex!",
  browser: "standalone:hidden!",
};
</script>
