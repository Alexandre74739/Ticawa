export type NotificationSettings = {
  notifications: boolean;
  channelPush: boolean;
  channelEmail: boolean;
};

export async function useNotificationSettings() {
  const { data: settings, error: loadError } =
    await useFetch<NotificationSettings>("/api/me/settings", {
      key: "settings",
    });

  let patch: Partial<NotificationSettings> = {};
  const save = useAction(() =>
    $fetch<NotificationSettings>("/api/me/settings", {
      method: "PATCH",
      body: patch,
    }),
  );

  // Affichage immédiat, puis retour arrière si l'enregistrement échoue.
  async function update(next: Partial<NotificationSettings>) {
    if (!settings.value) return;
    const previous = settings.value;
    patch = next;
    settings.value = { ...previous, ...next };
    settings.value = (await save.execute()) ?? previous;
  }

  return {
    settings,
    loadError,
    saving: save.pending,
    saveError: save.error,
    update,
  };
}
