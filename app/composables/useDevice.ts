export type Platform = "ios" | "android" | "desktop";

const platform = ref<Platform>("android");
const standalone = ref(false);
let detected = false;

function detect() {
  const ua = navigator.userAgent;
  const ios =
    /iPhone|iPad|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const uaMobile = (navigator as { userAgentData?: { mobile?: boolean } })
    .userAgentData?.mobile;
  const touch = matchMedia("(pointer: coarse)").matches;

  platform.value = ios
    ? "ios"
    : uaMobile || touch || /Android/.test(ua)
      ? "android"
      : "desktop";
  standalone.value =
    matchMedia("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true;
}

export function useDevice() {
  if (import.meta.client && !detected) {
    detected = true;
    detect();
  }
  return {
    platform: readonly(platform),
    isDesktop: computed(() => platform.value === "desktop"),
    isStandalone: readonly(standalone),
  };
}
