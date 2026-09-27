<template>
  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
  >
    <div
      v-if="guideOpen"
      class="fixed inset-0 z-90 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
      @click.self="guideOpen = false"
      @keydown.esc="guideOpen = false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-guide-title"
        class="relative w-full max-w-md rounded-4xl bg-paper p-6 text-center text-ink shadow-2xl shadow-ink/30 md:p-8"
      >
        <button
          ref="closeButton"
          type="button"
          class="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
          @click="guideOpen = false"
        >
          <X class="size-5" />
          <span class="sr-only">Fermer</span>
        </button>

        <BrandLogo class="mx-auto h-9 w-auto" />

        <h2
          id="install-guide-title"
          class="mt-5 font-display text-2xl leading-tight font-extrabold"
        >
          {{ content.title }}
        </h2>
        <p class="mt-2 leading-relaxed text-ink/75">{{ content.intro }}</p>

        <ol v-if="content.steps.length" class="mt-6 space-y-3 text-left">
          <li
            v-for="(step, i) in content.steps"
            :key="i"
            class="flex items-center gap-4 rounded-2xl bg-lavender px-4 py-3"
          >
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-indigo font-display font-bold text-paper"
            >
              {{ i + 1 }}
            </span>
            <span class="flex-1">{{ step.text }}</span>
            <component :is="step.icon" class="size-5 shrink-0 text-indigo" />
          </li>
        </ol>

        <div
          v-if="platform === 'desktop' && url"
          class="mt-6 rounded-2xl bg-lavender p-4"
        >
          <UiQrCode
            :value="url"
            :label="`QR code vers ${host}`"
            class="mx-auto size-44 rounded-xl"
          />
          <p class="mt-3 text-sm font-semibold break-all text-indigo">
            {{ host }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { EllipsisVertical, Share, SquarePlus, X } from "@lucide/vue";

const { platform, guideOpen } = usePwaInstall();
const closeButton = ref<HTMLButtonElement | null>(null);
const host = ref("");
const url = ref("");
let opener: HTMLElement | null = null;

onMounted(() => {
  host.value = location.host;
  url.value = location.origin;
});

watch(guideOpen, async (open) => {
  if (open) {
    opener = document.activeElement as HTMLElement | null;
    await nextTick();
    closeButton.value?.focus();
  } else {
    opener?.focus();
  }
});

const content = computed(() => {
  if (platform.value === "ios")
    return {
      title: "Installer Ticawa sur iPhone",
      intro:
        "Apple ne permet pas l'installation en un clic : deux gestes suffisent.",
      steps: [
        { text: "Appuyez sur le bouton Partager du navigateur.", icon: Share },
        {
          text: "Choisissez « Sur l'écran d'accueil », puis « Ajouter ».",
          icon: SquarePlus,
        },
      ],
    };
  if (platform.value === "android")
    return {
      title: "Installer Ticawa",
      intro:
        "Votre navigateur ne propose pas l'installation directe. Passez par son menu.",
      steps: [
        { text: "Ouvrez le menu du navigateur.", icon: EllipsisVertical },
        {
          text: "Choisissez « Installer l'application » ou « Ajouter à l'écran d'accueil ».",
          icon: SquarePlus,
        },
      ],
    };
  return {
    title: "Ticawa s'installe sur votre téléphone",
    intro:
      "L'application est pensée pour le mobile. Scannez ce QR code avec votre iPhone ou votre Android, puis installez-la.",
    steps: [],
  };
});
</script>
