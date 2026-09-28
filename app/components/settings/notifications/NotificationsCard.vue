<template>
  <AccountCard
    title="Notifications"
    accent="Tico vous tient au courant"
    description="Avant qu’une garantie ne file à l’anglaise, Tico peut vous faire signe. À vous de choisir s’il le fait, et par où."
    mascot="Happy.svg"
    :delay="delay"
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
            description="Un rappel quand une garantie ou une assurance arrive à son terme."
            :disabled="saving"
            @update:model-value="update({ notifications: $event })"
          />
          <UiLabelCard class="mt-auto">
            <p class="text-sm">
              Tico retient vos choix dès maintenant. L’envoi des rappels arrive
              très bientôt dans l’app.
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

defineProps<{ delay?: number }>();

const { settings, loadError, saving, saveError, update } =
  await useNotificationSettings();
</script>
