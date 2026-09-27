export default defineNuxtPlugin(() => {
  // Sans manifeste, Chrome et Edge ne proposent pas l'installation sur PC.
  if (useDevice().isDesktop.value) return;

  useHead({ link: [{ rel: "manifest", href: "/manifest.webmanifest" }] });

  addEventListener("beforeinstallprompt", capturePwaPrompt);
  addEventListener("appinstalled", clearPwaPrompt);
});
