<template>
  <div class="flex items-start gap-4 rounded-3xl bg-lavender p-4">
    <span
      class="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper text-indigo shadow-sm shadow-indigo/10"
    >
      <component :is="action.icon" aria-hidden="true" class="size-6" />
    </span>

    <div class="min-w-0 flex-1">
      <p class="font-display font-bold">
        {{ log.adminEmail }} {{ action.label }}
        <NuxtLink
          v-if="log.targetExists"
          :to="`/dashboard/utilisateurs/${log.targetUserId}`"
          class="rounded text-indigo hover:underline focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
        >
          {{ log.targetEmail }}
        </NuxtLink>
        <span v-else class="text-indigo">{{ log.targetEmail }}</span>
      </p>
      <p class="text-sm text-ink/65">{{ date }}</p>

      <ul
        v-if="log.changes.length"
        class="mt-3 flex flex-col gap-1.5 rounded-2xl bg-paper px-3.5 py-3 text-sm"
      >
        <li v-for="change in log.changes" :key="change.field">
          <span class="font-semibold">{{ fieldLabels[change.field] ?? change.field }}</span>
          <template v-if="change.field !== 'logout'">
            :
            <span :class="!deleted && 'text-ink/55 line-through'">
              {{ showValue(change.field, change.before) }}
            </span>
            <template v-if="!deleted">
              <ArrowRight aria-label="devient" class="inline size-3.5 text-indigo" />
              <span class="font-medium text-indigo">
                {{ showValue(change.field, change.after) }}
              </span>
            </template>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import type { AdminLog } from "#shared/types/adminLog";
import { fieldLabels, logActions, showValue } from "~/data/adminLogs";

const props = defineProps<{ log: AdminLog }>();

const action = computed(() => logActions[props.log.action]);
// Un ticket supprimé n'a pas d'« après » : on liste juste ce qu'il contenait.
const deleted = computed(() => props.log.action === "ticket.delete");
// Fuseau fixé : le rendu serveur et le navigateur affichent la même heure.
const date = computed(() =>
  new Date(props.log.createdAt).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }),
);
</script>
