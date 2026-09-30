<template>
  <Teleport to="body">
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photographier un ticket"
      class="fixed inset-0 z-90 flex flex-col bg-ink text-paper"
      style="padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom)"
      @keydown.esc="emit('close')"
    >
      <div class="relative min-h-0 flex-1 overflow-hidden">
        <video ref="video" muted playsinline class="size-full object-cover" />
        <div
          v-if="ready"
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-8 inset-y-10 rounded-4xl border-2 border-dashed border-paper/80 shadow-[0_0_0_100vmax_color-mix(in_oklab,var(--color-ink)_45%,transparent)]"
        />
        <p
          v-if="ready"
          class="absolute inset-x-0 top-4 text-center font-display font-semibold"
        >
          Cadrez le ticket en entier
        </p>
        <div
          v-if="error"
          class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <UiTicoMascot mascot="Sad.svg" />
          <p class="max-w-xs">{{ error }}</p>
          <UiButton variant="light" to="/parametres"
            >Ouvrir les paramètres</UiButton
          >
        </div>
      </div>

      <div class="grid grid-cols-3 items-center px-6 py-5">
        <button
          ref="closeButton"
          type="button"
          :class="round"
          @click="emit('close')"
        >
          <X aria-hidden="true" class="size-6" />
          <span class="sr-only">Fermer l'appareil photo</span>
        </button>
        <button
          type="button"
          :disabled="!ready || busy"
          class="mx-auto grid size-20 place-items-center rounded-full border-4 border-paper bg-paper/15 transition-transform active:scale-90 disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-indigo focus-visible:outline-none"
          @click="shoot"
        >
          <span class="size-14 rounded-full bg-paper" />
          <span class="sr-only">Prendre la photo</span>
        </button>
        <label
          :class="[
            round,
            'ml-auto cursor-pointer focus-within:ring-2 focus-within:ring-paper',
          ]"
        >
          <input type="file" accept="image/*" class="sr-only" @change="pick" />
          <Images aria-hidden="true" class="size-6" />
          <span class="sr-only">Choisir une photo déjà prise</span>
        </label>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Images, X } from "@lucide/vue";

const emit = defineEmits<{ close: []; file: [file: File] }>();

const video = ref<HTMLVideoElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
const busy = ref(false);
const { ready, error, start, stop, capture } = useCamera(video);

const round =
  "grid size-12 place-items-center rounded-full bg-paper/15 transition-colors hover:bg-paper/25 focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none";

async function shoot() {
  busy.value = true;
  try {
    const file = await capture();
    stop();
    emit("file", file);
  } finally {
    busy.value = false;
  }
}

function pick(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  stop();
  emit("file", file);
}

onMounted(() => {
  document.documentElement.style.overflow = "hidden";
  closeButton.value?.focus();
  start();
});
onBeforeUnmount(() => (document.documentElement.style.overflow = ""));
</script>
