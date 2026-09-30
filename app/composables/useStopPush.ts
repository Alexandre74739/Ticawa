type Settings = {
  notifications: boolean;
  channelPush: boolean;
  channelEmail: boolean;
};

export function useStopPush() {
  const { data: settings } = useNuxtData<Settings>("settings");
  const push = usePushSubscription();

  return useAction(async () => {
    await push.unsubscribe();

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
