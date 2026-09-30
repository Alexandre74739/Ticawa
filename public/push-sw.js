self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Ticawa", {
      body: data.body || "Une échéance approche.",
      icon: "/pwa/icon-192.png?v=2",
      badge: "/pwa/icon-192.png?v=2",
      lang: "fr",
      tag: data.tag,
      data: { url: data.url || "/dashboard/echeances" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(
    event.notification.data?.url || "/dashboard",
    self.location.origin,
  );
  if (url.origin !== self.location.origin) return;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (windows) => {
        const open = windows.find((w) => w.url.startsWith(self.location.origin));
        if (open) {
          await open.focus();
          return open.navigate(url.href).catch(() => self.clients.openWindow(url.href));
        }
        return self.clients.openWindow(url.href);
      }),
  );
});

self.addEventListener("pushsubscriptionchange", (event) => {
  const options = event.oldSubscription?.options;
  if (!options) return;
  event.waitUntil(
    self.registration.pushManager.subscribe(options).then((subscription) =>
      fetch("/api/me/push", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      }),
    ),
  );
});
