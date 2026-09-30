<template>
  <div v-if="state !== 'hidden'" class="flex items-start gap-4 rounded-3xl bg-lavender p-4 md:p-5">
    <UiTicoMascot :mascot="state === 'done' ? 'Perfect.svg' : 'Happy.svg'" />
    <div class="min-w-0 flex-1 space-y-3">
      <p class="font-display text-lg font-bold">
        {{ state === "done" ? "C'est activé !" : "Être prévenu sur ce téléphone" }}
      </p>
      <p v-if="state === 'ask'" class="text-sm text-ink/75">
        En plus de l'e-mail, Tico vous envoie une notification avant la fin d'un
        échange, d'une garantie ou d'une assurance.
      </p>
      <UiAlert v-if="error" tone="danger">{{ error }}</UiAlert>
      <div v-if="state === 'ask'" class="flex flex-wrap gap-2">
        <UiButton :disabled="pending" @click="activate">Activer les notifications</UiButton>
        <UiButton variant="ghost" @click="later">Plus tard</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const KEY = "ticawa:push-prompt";
const MONTH = 30 * 86_400_000;

const { platform, isDesktop, isStandalone } = useDevice();
const state = ref<"hidden" | "ask" | "done">("hidden");
const { pending, error, execute } = useAction(usePushSubscription().enable);

async function activate() {
  await execute();
  if (!error.value) state.value = "done";
}

function later() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {}
  state.value = "hidden";
}

onMounted(() => {
  let dismissed = 0;
  try {
    dismissed = Number(localStorage.getItem(KEY));
  } catch {}
  const possible =
    !isDesktop.value &&
    "PushManager" in window &&
    "Notification" in window &&
    // Sur iPhone, le push n'existe que dans l'app ajoutée à l'écran d'accueil.
    (platform.value !== "ios" || isStandalone.value);
  if (possible && Notification.permission === "default" && Date.now() - dismissed > MONTH)
    state.value = "ask";
});
</script>
