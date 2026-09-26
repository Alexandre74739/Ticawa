import type { Ref } from "vue";
import type { Mood } from "~/data/tico";
import type { Flash } from "~/utils/moodTriggers";

const LOOK = 12;
const STRIDE = 20;
const FEET = 18;
const DARK = ".bg-indigo, .bg-ink";
const INTERACTIVE = "a, button, [role='button'], label";
const BUTTON = "[data-button]";
const INDIGO = [90, 103, 184];
const PAPER = [251, 249, 245];
const TERRACOTTA = [161, 91, 66];
const RAGE = { clicks: 3, within: 700, radius: 60, lasts: 2000 };
const FLASH_LASTS = 2500;
const IDLE_AFTER = 8000;

const BLINK: Keyframe[] = [
  { transform: "scaleY(1)" },
  { transform: "scaleY(0.1)", offset: 0.4 },
  { transform: "scaleY(1)" },
];
const PRESS: Keyframe[] = [
  { transform: "scale(1)" },
  { transform: "scale(1.14, 0.84)", offset: 0.35 },
  { transform: "scale(1)" },
];
const SHAKE: Keyframe[] = [0, -5, 5, -4, 3, 0].map((x) => ({
  transform: `translateX(${x}px) rotate(${x * 1.5}deg)`,
}));

type Point = { x: number; y: number };

export const cursorShape = {
  active: false,
  tico: { x: 0, y: 0 } as Point,
  path: [] as Point[],
};

export function useCursor(
  dot: Ref<HTMLElement | null>,
  tico: Ref<HTMLElement | null>,
  canvas: Ref<HTMLCanvasElement | null>,
) {
  const enabled = ref(false);
  const started = ref(false);
  const visible = ref(false);
  const onDark = ref(false);
  const hovering = ref(false);
  const onButton = ref(false);
  const angry = ref(false);
  const flash = ref<Flash | null>(null);
  const idle = ref(false);
  const mood = computed<Mood>(() => {
    if (angry.value) return "angry";
    if (flash.value) return flash.value;
    if (onButton.value) return "perfect";
    if (started.value && !visible.value) return "sad";
    return idle.value ? "confused" : "neutral";
  });
  let cleanup = () => {};

  onMounted(() => {
    const [d, t, c] = [dot.value, tico.value, canvas.value];
    const body = t?.querySelector("svg");
    if (!d || !t || !c || !body || !matchMedia("(pointer: fine)").matches)
      return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const trail = createTrail();
    const fx = createFx(c);
    const pupils = [...t.querySelectorAll<SVGElement>(".pupil")].map((el) => ({
      el,
      look: Number(el.dataset.look ?? 1),
    }));
    const eyes = [...t.querySelectorAll<SVGElement>(".eye")];
    const mouse = { x: 0, y: 0 };
    const gaze = { x: 0, y: 0 };
    const ticoAt = { x: 0, y: 0 };
    let clicks: { x: number; y: number; at: number }[] = [];
    let lean = 0;
    let walked = 0;
    let lastPrint = 0;
    let side = 1;
    const ink = [...INDIGO];
    let frame = 0;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let calmTimer: ReturnType<typeof setTimeout>;
    let flashTimer: ReturnType<typeof setTimeout>;
    let idleTimer: ReturnType<typeof setTimeout>;

    const blink = () =>
      eyes.forEach((eye) => eye.animate(BLINK, { duration: 220 }));
    const idleBlink = () => {
      blinkTimer = setTimeout(
        () => {
          if (started.value && !angry.value) blink();
          idleBlink();
        },
        2500 + Math.random() * 3500,
      );
    };

    const wake = () => (frame ||= requestAnimationFrame(tick));
    const sample = () => {
      const below = document.elementFromPoint(mouse.x, mouse.y);
      onDark.value = !!below?.closest(DARK);
      hovering.value = !!below?.closest(INTERACTIVE);
      onButton.value = !!below?.closest(BUTTON);
      wake();
    };

    const triggers = createMoodTriggers((f) => {
      flash.value = f;
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => (flash.value = null), FLASH_LASTS);
    });

    const walk = (x: number, y: number, dx: number, dy: number) => {
      const angle = Math.atan2(dy, dx);
      side = -side;
      const px = -Math.sin(angle) * 6 * side;
      const py = Math.cos(angle) * 6 * side;
      fx.step(x + px, y + FEET + py, angle);
      lastPrint = walked;
    };

    const tick = () => {
      const s = trail.advance(reduced);
      if (!s) return (frame = 0);
      const moved = Math.hypot(s.dx, s.dy);
      Object.assign(ticoAt, { x: s.x, y: s.y });
      cursorShape.path = trail.path;
      const effort = reduced ? 0 : Math.min(s.speed / 8, 1);
      walked += moved;
      if (effort > 0.2 && walked - lastPrint > STRIDE)
        walk(s.x, s.y, s.dx, s.dy);
      lean += ((moved ? (s.dx / moved) * effort * 14 : 0) - lean) * 0.15;
      const waddle = Math.sin(walked / 9) * effort * 8;
      const lift = -Math.abs(Math.sin(walked / 9)) * effort * 3;
      t.style.transform = `translate(${s.x}px, ${s.y + lift}px) rotate(${lean + waddle}deg)`;

      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const len = Math.hypot(dx, dy) || 1;
      const gx = ((dx / len) * LOOK - gaze.x) * 0.2;
      const gy = ((dy / len) * LOOK - gaze.y) * 0.2;
      gaze.x += gx;
      gaze.y += gy;
      pupils.forEach(({ el, look }) => {
        el.style.transform = `translate(${gaze.x * look}px, ${gaze.y * look}px)`;
      });

      const goal =
        mood.value === "angry" ? TERRACOTTA : onDark.value ? PAPER : INDIGO;
      let fading = 0;
      ink.forEach((v, i) => {
        const delta = goal[i]! - v;
        ink[i] = v + delta * 0.12;
        fading += Math.abs(delta);
      });
      const color = `rgb(${ink.map(Math.round).join(" ")})`;
      const busy = fx.draw(color, trail.path, trail.eaten);

      const settled =
        !busy &&
        s.speed + Math.abs(lean) + Math.abs(gx) + Math.abs(gy) < 0.05 &&
        fading < 1;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const dx = e.clientX - mouse.x;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (started.value) trail.push(mouse);
      else trail.reset(mouse);
      if (visible.value) triggers.move(mouse.x, mouse.y, dx, ticoAt);
      started.value = visible.value = true;
      cursorShape.active = true;
      idle.value = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => (idle.value = true), IDLE_AFTER);
      d.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      sample();
    };

    const onDown = (e: PointerEvent) => {
      const now = performance.now();
      clicks = clicks.filter(
        (k) =>
          now - k.at < RAGE.within &&
          Math.hypot(k.x - e.clientX, k.y - e.clientY) < RAGE.radius,
      );
      clicks.push({ x: e.clientX, y: e.clientY, at: now });
      if (clicks.length >= RAGE.clicks) {
        angry.value = true;
        clearTimeout(calmTimer);
        calmTimer = setTimeout(() => {
          angry.value = false;
          wake();
        }, RAGE.lasts);
        wake();
      }
      if (!angry.value) blink();
      if (!reduced)
        body.animate(angry.value ? SHAKE : PRESS, { duration: 320 });
    };
    const onLeave = () => {
      visible.value = false;
      cursorShape.active = false;
      triggers.reset();
      clearTimeout(idleTimer);
    };

    cursorShape.tico = ticoAt;
    fx.resize();
    idleBlink();
    enabled.value = true;
    root.classList.add("custom-cursor");
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("scroll", sample, { passive: true });
    addEventListener("resize", fx.resize);
    root.addEventListener("mouseleave", onLeave);

    cleanup = () => {
      clearTimeout(blinkTimer);
      clearTimeout(calmTimer);
      clearTimeout(flashTimer);
      clearTimeout(idleTimer);
      root.classList.remove("custom-cursor");
      cursorShape.active = false;
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("scroll", sample);
      removeEventListener("resize", fx.resize);
      root.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  });

  onBeforeUnmount(() => cleanup());

  return { enabled, started, visible, onDark, hovering, mood };
}
