<template>
  <SettingsPanel :icon="Send" title="Canal">
    <UiToggle
      :model-value="settings.channelPush"
      label="Sur ce téléphone"
      :description="pushHint"
      :disabled="pushDisabled"
      @update:model-value="togglePush"
    />
    <hr class="border-ink/10" />
    <UiToggle
      :model-value="settings.channelEmail"
      label="Par e-mail"
      :description="emailHint"
      :disabled="emailDisabled"
      @update:model-value="emit('update', { channelEmail: $event })"
    />
  </SettingsPanel>
</template>

<script setup lang="ts">
import { Send } from "@lucide/vue";
import type { NotificationSettings } from "~/composables/useNotificationSettings";

const props = defineProps<{
  settings: NotificationSettings;
  disabled?: boolean;
}>();
const emit = defineEmits<{ update: [next: Partial<NotificationSettings>] }>();

const { states, request } = usePermissions();
const { platform, isDesktop } = useDevice();

const pushGranted = () => states.notifications === "granted";

async function togglePush(on: boolean) {
  if (on && !pushGranted()) {
    await request("notifications");
    if (!pushGranted()) return;
  }
  emit("update", { channelPush: on });
}

const pushUnavailable = computed(
  () =>
    isDesktop.value ||
    states.notifications === "unsupported" ||
    states.notifications === "denied",
);

const lastChannel = computed(
  () =>
    props.settings.notifications &&
    props.settings.channelPush !== props.settings.channelEmail,
);
const locked = computed(() => props.disabled || !props.settings.notifications);

const pushDisabled = computed(
  () =>
    locked.value ||
    (props.settings.channelPush ? lastChannel.value : pushUnavailable.value),
);
const emailDisabled = computed(
  () => locked.value || (props.settings.channelEmail && lastChannel.value),
);

const keepOne = "Gardez au moins un canal pour recevoir les alertes.";

const pushHint = computed(() => {
  if (isDesktop.value) return "À activer depuis l’app, sur votre téléphone.";
  if (states.notifications === "unsupported")
    return platform.value === "ios"
      ? "Sur iPhone, installez d’abord Ticawa sur l’écran d’accueil."
      : "Ce navigateur ne gère pas les notifications.";
  if (states.notifications === "denied")
    return "Bloquées sur cet appareil : réactivez-les dans Autorisations, plus bas.";
  if (props.settings.channelPush && lastChannel.value) return keepOne;
  return "Une notification, même quand l’app est fermée.";
});

const emailHint = computed(() =>
  props.settings.channelEmail && lastChannel.value
    ? keepOne
    : "Sur l’adresse de votre compte.",
);
</script>
