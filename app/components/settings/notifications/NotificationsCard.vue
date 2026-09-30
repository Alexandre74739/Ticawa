<template>
  <AccountCard
    title="Notifications"
    accent="Tico vous tient au courant"
    description="Avant qu’une garantie ne file à l’anglaise, Tico peut vous faire signe. À vous de choisir s’il le fait, et par où."
    mascot="Happy.svg"
  >
    <UiAlert v-if="loadError" tone="danger">
      Impossible de charger vos réglages. Rechargez la page.
    </UiAlert>

    <div v-else-if="settings" class="space-y-4">
      <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <SettingsPanel :icon="BellRing" title="Alertes d’expiration">
          <UiToggle
            :model-value="settings.notifications"
            label="Me prévenir avant qu’une garantie expire"
            description="Un rappel quand un délai d’échange, une garantie ou une assurance arrive à son terme."
            :disabled="saving"
            @update:model-value="update({ notifications: $event })"
          />
          <UiLabelCard class="mt-auto">
            <p class="text-sm">
              Tico vous fait signe 30 puis 7 jours avant la fin d’une garantie
              ou d’une assurance, 3 jours puis la veille pour un échange. Les
              rappels partent chaque matin.
            </p>
          </UiLabelCard>
        </SettingsPanel>

        <SettingsNotificationsChannelsPanel
          :settings="settings"
          :disabled="saving"
          @update="update"
        />
      </div>

      <UiAlert v-if="saveError" tone="danger">{{ saveError }}</UiAlert>
    </div>
  </AccountCard>
</template>

<script setup lang="ts">
import { BellRing } from "@lucide/vue";

const { settings, loadError, saving, saveError, update } =
  await useNotificationSettings();
</script>
