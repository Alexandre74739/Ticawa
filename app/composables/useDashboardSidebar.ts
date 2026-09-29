const KEY = "ticawa:sidebar";
const PHONE = "(max-width: 767px)";
const RAIL = "(max-width: 1023px)";

let listening = false;

export function useDashboardSidebar() {
  const collapsed = useState<boolean | null>("sidebar-collapsed", () => null);
  const drawer = useState("sidebar-drawer", () => false);
  const close = () => (drawer.value = false);

  onMounted(() => {
    if (listening) return;
    listening = true;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null) collapsed.value = saved === "1";
    } catch {}
    matchMedia(PHONE).addEventListener("change", close);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  });

  function toggle() {
    collapsed.value = !(collapsed.value ?? matchMedia(RAIL).matches);
    try {
      localStorage.setItem(KEY, collapsed.value ? "1" : "0");
    } catch {}
  }

  return {
    collapsed: readonly(collapsed),
    drawer: readonly(drawer),
    isPhone: () => matchMedia(PHONE).matches,
    toggle,
    open: () => (drawer.value = true),
    close,
  };
}
