type Settings = {
  notifications: boolean;
  channelPush: boolean;
  channelEmail: boolean;
};

// Ce que l'app peut couper elle-même : l'envoi des notifications sur ce téléphone.
export function useStopPush() {
  const { data: settings } = useNuxtData<Settings>("settings");

  return useAction(async () => {
    const registration = await navigator.serviceWorker?.getRegistration();
    const subscription = await registration?.pushManager?.getSubscription();
    await subscription?.unsubscribe();

    if (!settings.value?.channelPush) return "";
    const alone = !settings.value.channelEmail;
    settings.value = await $fetch<Settings>("/api/me/settings", {
      method: "PATCH",
      body: alone
        ? { channelPush: false, notifications: false }
        : { channelPush: false },
    });
    return alone
      ? "Ticawa n’envoie plus rien sur ce téléphone. C’était votre seul canal : les alertes sont coupées, activez l’e-mail pour les recevoir à nouveau."
      : "Ticawa n’envoie plus rien sur ce téléphone. Vos alertes continuent par e-mail.";
  });
}
