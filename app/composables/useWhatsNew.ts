import { changelog } from "~/data/changelog";

const SHOW_KEY = "ticawa:show-updates";
const SEEN_KEY = "ticawa:last-update-seen";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function useWhatsNew() {
  const showUpdates = useState("show-updates", () => true);
  const open = useState("whats-new-open", () => false);
  const latest = changelog[0];

  function load() {
    showUpdates.value = read(SHOW_KEY) !== "0";
  }

  function setShowUpdates(value: boolean) {
    showUpdates.value = value;
    write(SHOW_KEY, value ? "1" : "0");
  }

  // Première visite : on retient la version sans l'annoncer.
  function check() {
    if (!latest) return;
    load();
    const seen = read(SEEN_KEY);
    write(SEEN_KEY, latest.id);
    if (seen && seen !== latest.id && showUpdates.value) open.value = true;
  }

  return { latest, showUpdates, open, load, setShowUpdates, check };
}
