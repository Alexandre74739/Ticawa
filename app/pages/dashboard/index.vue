<template>
  <div>
    <DashboardHeading
      :title="`Bonjour ${user?.prenom ?? ''},`"
      accent="voici vos droits"
    />

    <UiAlert v-if="error" tone="danger">
      Impossible de charger votre vue d'ensemble. Réessayez dans un instant.
    </UiAlert>

    <OverviewCard
      v-else-if="data && !data.total"
      indigo
      title="Votre premier ticket"
      text="Depuis l'app installée, photographiez un ticket de caisse ou importez une facture : Tico garde la preuve d'achat et calcule vos délais de retour."
      :actions="addTicket.filter((action) => action.only === 'installed')"
    >
      <UiButton
        variant="light"
        arrow
        class="mt-6 standalone:hidden!"
        @click="install"
      >
        Installer l'app
      </UiButton>
    </OverviewCard>

    <div v-else-if="data && summary" class="flex flex-col gap-4 md:gap-6">
      <OverviewCard indigo v-bind="summary">
        <div
          role="progressbar"
          :aria-valuenow="summary.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${data.tracked} tickets complets sur ${data.ongoing} en cours`"
          class="mt-6 h-3 overflow-hidden rounded-full bg-paper/15"
        >
          <div
            class="h-full rounded-full bg-paper transition-[width] duration-700"
            :style="{ width: `${summary.percent}%` }"
          />
        </div>
        <p v-if="data.ongoing" class="mt-2 text-sm text-paper/70">
          {{ data.tracked }} ticket{{ data.tracked > 1 ? "s" : "" }} complet{{
            data.tracked > 1 ? "s" : ""
          }}
          sur {{ data.ongoing }} en cours
        </p>

        <template #footer>
          <aside class="mt-8 flex gap-3 border-t border-paper/15 pt-6">
            <Lightbulb
              aria-hidden="true"
              class="size-5 shrink-0 text-lavender"
            />
            <p class="text-sm leading-relaxed text-paper/90">
              <strong class="font-display font-bold"
                >Le conseil de Tico :</strong
              >
              {{ tip.text }}
              <a
                :href="tip.source.href"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1 block w-fit rounded text-xs text-lavender underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
              >
                {{ tip.source.label }}
                <span class="sr-only">(nouvelle fenêtre)</span>
              </a>
            </p>
          </aside>
        </template>
      </OverviewCard>

      <div class="grid gap-4 md:gap-6 lg:grid-cols-2">
        <OverviewCard v-for="list in lists" :key="list.title" v-bind="list" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lightbulb } from "@lucide/vue";

useSeoMeta({
  title: "Vue d'ensemble",
  description:
    "Vos preuves d'achat, délais de retour et échéances en un coup d'œil. Tico veille et vous prévient avant la date limite.",
});

const { user } = useUserSession();
const { install } = usePwaInstall();
const { data, error, summary, tip, lists, addTicket } = await useOverview();
</script>
