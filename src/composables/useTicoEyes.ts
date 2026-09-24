import type { Ref } from "vue";

const MAX_X = 6;
const MAX_Y = 5;
const REACH = 400;
const EYES_AT = { x: 0.09, y: 0.23 };

const BLINK: Keyframe[] = [
  { transform: "scaleY(1)", easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
  { transform: "scaleY(0.08)", offset: 0.3 },
  {
    transform: "scaleY(0.08)",
    offset: 0.4,
    easing: "cubic-bezier(0, 0.55, 0.45, 1)",
  },
  { transform: "scaleY(1)" },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function useTicoEyes(svg: Ref<SVGSVGElement | null>) {
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (ms: number, fn: () => void) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };
  let cleanup = () => {};

  onMounted(() => {
    const el = svg.value;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const eyes = [...el.querySelectorAll<SVGGElement>(".eye")];
    const pupils = [...el.querySelectorAll<SVGPathElement>(".pupil")];
    const target = { x: 0, y: 0 };
    const gaze = { x: 0, y: 0 };
    let frame = 0;
    let lastPointer = -Infinity;

    const blink = (twice = false) =>
      eyes.forEach((eye, i) =>
        eye.animate(BLINK, {
          duration: 250,
          delay: i * 25,
          iterations: twice ? 2 : 1,
        }),
      );

    const tick = () => {
      gaze.x += (target.x - gaze.x) * 0.2;
      gaze.y += (target.y - gaze.y) * 0.2;
      const t = `translate(${gaze.x * MAX_X}px, ${gaze.y * MAX_Y}px)`;
      pupils.forEach((p) => (p.style.transform = t));
      const moving =
        Math.abs(target.x - gaze.x) + Math.abs(target.y - gaze.y) > 0.002;
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const lookAt = (x: number, y: number) => {
      target.x = x;
      target.y = y;
      frame ||= requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * EYES_AT.x);
      const dy = e.clientY - (r.top + r.height * EYES_AT.y);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(d / REACH, 1) / d;
      lastPointer = performance.now();
      lookAt(dx * k, dy * k);
    };
    const onLeave = () => {
      lastPointer = -Infinity;
      lookAt(0, 0);
    };
    const onEnter = () => blink(true);

    const scheduleBlink = () =>
      later(6000, () => {
        blink();
        scheduleBlink();
      });

    const scheduleGlance = () =>
      later(rand(2500, 5500), () => {
        if (performance.now() - lastPointer > 4000) {
          const away = Math.random() < 0.6;
          lookAt(away ? rand(-1, 1) : 0, away ? rand(-0.5, 1) : 0);
        }
        scheduleGlance();
      });

    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("pointerdown", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    el.addEventListener("pointerenter", onEnter);
    scheduleBlink();
    scheduleGlance();

    cleanup = () => {
      removeEventListener("pointermove", onPointer);
      removeEventListener("pointerdown", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(frame);
    };
  });

  onBeforeUnmount(() => {
    timers.forEach(clearTimeout);
    cleanup();
  });
}
