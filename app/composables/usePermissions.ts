export type PermissionKey = "notifications" | "camera" | "storage";
export type PermissionState = "granted" | "prompt" | "denied" | "unsupported";

const states = reactive<Record<PermissionKey, PermissionState>>({
  notifications: "prompt",
  camera: "prompt",
  storage: "prompt",
});
const ready = ref(false);
// persist() n'a pas d'état « refusé » : on retient le refus pour la session.
let storageRefused = false;

function readNotifications(): PermissionState {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission === "default"
    ? "prompt"
    : Notification.permission;
}

async function readCamera(): Promise<PermissionState> {
  if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
  try {
    const status = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });
    return status.state;
  } catch {
    // Firefox ne sait pas interroger la caméra : on le saura à la demande.
    return "prompt";
  }
}

async function readStorage(): Promise<PermissionState> {
  if (!navigator.storage?.persisted) return "unsupported";
  if (await navigator.storage.persisted()) return "granted";
  return storageRefused ? "denied" : "prompt";
}

async function refresh() {
  const [camera, storage] = await Promise.all([readCamera(), readStorage()]);
  states.notifications = readNotifications();
  states.camera = camera;
  states.storage = storage;
  ready.value = true;
}

async function request(key: PermissionKey) {
  let failed = false;
  try {
    if (key === "notifications") await Notification.requestPermission();
    if (key === "camera") {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
    }
    if (key === "storage") storageRefused = !(await navigator.storage.persist());
  } catch {
    failed = true;
  }
  await refresh();
  // Sans Permissions API, un refus caméra n'est visible qu'ici.
  if (key === "camera" && failed) states.camera = "denied";
}

function onVisible() {
  if (document.visibilityState === "visible") refresh();
}

export function usePermissions() {
  onMounted(() => {
    refresh();
    document.addEventListener("visibilitychange", onVisible);
  });
  onBeforeUnmount(() =>
    document.removeEventListener("visibilitychange", onVisible),
  );

  return { states: readonly(states), ready: readonly(ready), request };
}
