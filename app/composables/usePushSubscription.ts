import type { NotificationSettings } from "~/composables/useNotificationSettings";

const toKey = (base64url: string) =>
  Uint8Array.from(atob(base64url.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

// Sans service worker (en dev), `ready` ne se résout jamais.
function registration() {
  if (!("serviceWorker" in navigator)) return Promise.resolve(null);
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
  return Promise.race([navigator.serviceWorker.ready, timeout]);
}

export function usePushSubscription() {
  const { vapidPublicKey } = useRuntimeConfig().public;
  const { data: settings } = useNuxtData<NotificationSettings>("settings");

  async function subscribe() {
    const reg = await registration();
    if (!reg?.pushManager || !vapidPublicKey)
      throw new Error("Les notifications ne sont pas disponibles sur cet appareil.");
    const subscription =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(vapidPublicKey) }));
    await $fetch("/api/me/push", { method: "POST", body: subscription.toJSON() });
  }

  async function unsubscribe() {
    const subscription = await (await registration())?.pushManager?.getSubscription();
    if (!subscription) return;
    await $fetch("/api/me/push", { method: "DELETE", body: { endpoint: subscription.endpoint } }).catch(() => {});
    await subscription.unsubscribe();
  }

  // Depuis un appui : autorisation, abonnement, puis canal push activé sur le compte.
  async function enable() {
    if ((await Notification.requestPermission()) !== "granted")
      throw new Error("Notifications refusées : autorisez-les dans les réglages du téléphone.");
    await subscribe();
    settings.value = await $fetch<NotificationSettings>("/api/me/settings", {
      method: "PATCH",
      body: { notifications: true, channelPush: true },
    });
  }

  return { subscribe, unsubscribe, enable };
}
