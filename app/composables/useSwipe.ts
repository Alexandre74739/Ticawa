export function useSwipe(handlers: {
  left?: () => void;
  right?: (startX: number) => void;
}) {
  let x = 0;
  let y = 0;

  function start(event: TouchEvent) {
    const touch = event.touches[0];
    if (!touch) return;
    x = touch.clientX;
    y = touch.clientY;
  }

  function end(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - x;
    const dy = touch.clientY - y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx > 0) handlers.right?.(x);
    else handlers.left?.();
  }

  onMounted(() => {
    addEventListener("touchstart", start, { passive: true });
    addEventListener("touchend", end, { passive: true });
  });
  onBeforeUnmount(() => {
    removeEventListener("touchstart", start);
    removeEventListener("touchend", end);
  });
}
