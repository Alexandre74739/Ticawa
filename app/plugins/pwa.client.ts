export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("service-worker:registered", ({ registration }) => {
    if (!registration) return;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && navigator.onLine)
        registration.update().catch(() => {});
    });
  });

  if (useDevice().isDesktop.value) return;

  useHead({ link: [{ rel: "manifest", href: "/manifest.webmanifest" }] });

  addEventListener("beforeinstallprompt", capturePwaPrompt);
  addEventListener("appinstalled", clearPwaPrompt);
});
