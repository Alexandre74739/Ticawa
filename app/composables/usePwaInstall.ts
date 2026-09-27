interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const deferred = shallowRef<BeforeInstallPromptEvent | null>(null);
const guideOpen = ref(false);

export function capturePwaPrompt(event: Event) {
  event.preventDefault();
  deferred.value = event as BeforeInstallPromptEvent;
}

export function clearPwaPrompt() {
  deferred.value = null;
}

export function usePwaInstall() {
  const { platform, isStandalone } = useDevice();

  async function install() {
    const event = deferred.value;
    if (!event) return (guideOpen.value = true);
    await event.prompt();
    await event.userChoice;
    deferred.value = null;
  }

  return {
    platform,
    installed: isStandalone,
    guideOpen,
    install,
  };
}
