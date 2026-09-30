<template>
  <aside class="flex-col gap-2 rounded-3xl bg-lavender p-3">
    <h2 class="flex h-8 items-center font-display text-lg font-bold">
      {{ upcoming.length }} échéance{{ upcoming.length > 1 ? "s" : "" }} à venir
    </h2>

    <ul v-if="upcoming.length" class="flex flex-col gap-1">
      <li
        v-for="{ ticket, kind, window } in upcoming.slice(0, 5)"
        :key="`${ticket.id}-${kind}`"
      >
        <NuxtLink
          :to="`/dashboard/tickets/${ticket.id}`"
          class="group flex items-center gap-3 rounded-xl bg-paper p-2 shadow-sm shadow-indigo/10 transition-colors duration-300 hover:bg-indigo/10 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
        >
          <img
            :src="`/mascotte/${window.daysLeft < 15 ? 'Surprised' : 'Neutre'}.svg`"
            alt=""
            class="w-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span class="min-w-0">
            <span class="block truncate font-display text-sm font-bold">
              {{ ticket.name ?? ticket.merchant ?? "Magasin inconnu" }}
            </span>
            <span class="block truncate text-xs text-ink/60">
              {{ coverageLabels[kind] }} ·
              {{ formatDate(window.iso, "short") }} ·
              {{
                window.daysLeft ? `dans ${window.daysLeft} j` : "aujourd'hui"
              }}
            </span>
          </span>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="text-sm text-ink/65">
      Aucune échéance en cours : ni échange, ni garantie, ni assurance.
    </p>

    <DeadlineLegend class="mt-auto" />
  </aside>
</template>

<script setup lang="ts">
import type { Deadline } from "#shared/types/ticket";

const props = defineProps<{ deadlines: Deadline[] }>();

const upcoming = computed(() =>
  props.deadlines
    .map((deadline) => ({ ...deadline, window: countdown(deadline.date) }))
    .filter(({ window }) => window.daysLeft >= 0),
);
</script>
