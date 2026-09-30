export default defineNuxtPlugin((nuxtApp) => {
  const { loggedIn } = useUserSession();

  nuxtApp.hook("service-worker:registered", ({ registration }) => {
    if (!registration) return;
    // Le navigateur renouvelle parfois l'abonnement push : on renvoie le courant.
    registration.pushManager?.getSubscription().then((subscription) => {
      if (subscription && loggedIn.value)
        $fetch("/api/me/push", { method: "POST", body: subscription.toJSON() }).catch(() => {});
    });
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
