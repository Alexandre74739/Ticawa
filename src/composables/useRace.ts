import type { Ref } from "vue";
import {
  dustShapes,
  FROM,
  GROUND,
  runners,
  SIGN_FOOT,
  SIGN_GRIP,
  SPEED,
  TO,
} from "~/data/race";

export const REST_BASE = 90;
const TROUPE_W = 900;
const SUBSTEP = 1 / 120;
const CONTACT = 0.32;
const REST_LEAN = 7;
const SIGN_LEAN = 2;

type Spring = { x: number; v: number };
type Runner = {
  el: SVGGElement;
  shadow: SVGEllipseElement;
  stride: number;
  air: boolean;
  t: number;
  dur: number;
  h: number;
  y: number;
  vy: number;
  squash: Spring;
  lean: Spring;
};
type Puff = {
  el: SVGUseElement;
  live: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  peak: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const pull = (s: Spring, to: number, k: number, c: number, dt: number) => {
  s.v += (k * (to - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
};

export const restPose = (x: number) =>
  `translate(${REST_BASE + x + 110} ${GROUND}) rotate(${REST_LEAN}) translate(-110 -212)`;

export function useRace(root: Ref<SVGSVGElement | null>) {
  let frame = 0;
  let io: IntersectionObserver | undefined;

  onMounted(() => {
    const svg = root.value;
    if (!svg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = <T extends Element>(sel: string) => [
      ...svg.querySelectorAll<T>(sel),
    ];
    const shadows = q<SVGEllipseElement>("[data-shadow]");
    const sign = svg.querySelector<SVGGElement>("[data-sign]")!;
    const bodies = q<SVGGElement>("[data-runner]").map<Runner>((el, i) => ({
      el,
      shadow: shadows[i]!,
      stride: runners[i]!.stride,
      air: false,
      t: i * 0.13,
      dur: 0,
      h: 0,
      y: 0,
      vy: 0,
      squash: { x: 1, v: 0 },
      lean: { x: REST_LEAN, v: 0 },
    }));
    const puffs = q<SVGUseElement>("[data-dust]").map<Puff>((el) => ({
      el,
      live: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      age: 0,
      life: 1,
      size: 1,
      peak: 0,
    }));
    const carrier = bodies[runners.findIndex((r) => r.mood === "happy")]!;
    const signY: Spring = { x: GROUND - 53, v: 0 };
    const signTilt: Spring = { x: SIGN_LEAN, v: 0 };
    let base = REST_BASE;

    const lapBounds = () => {
      const ctm = svg.getScreenCTM();
      const box = svg.getBoundingClientRect();
      if (!ctm) return { from: FROM, to: TO };
      return {
        from: (box.left - ctm.e) / ctm.a - TROUPE_W,
        to: (box.right - ctm.e) / ctm.a + 60,
      };
    };
    let bounds = lapBounds();
    let clock = 0;

    const kick = (x: number, count: number) => {
      for (let n = 0; n < count; n++) {
        const p = puffs.find((p) => !p.live);
        if (!p) return;
        p.el.setAttribute(
          "href",
          `#race-dust-${Math.floor(rand(0, dustShapes.length))}`,
        );
        Object.assign(p, {
          live: true,
          age: 0,
          x: x - rand(0, 50),
          y: GROUND - rand(2, 16),
          vx: rand(-80, -30),
          vy: rand(-26, -8),
          life: rand(1.3, 2.4),
          size: rand(0.8, 1.6),
          peak: rand(0.2, 0.36),
        });
      }
    };

    const worldX = (i: number) =>
      base + runners[i]!.x + 110 + 16 * Math.sin(clock * 1.3 + i * 2.1);

    const simulate = (dt: number) => {
      clock += dt;
      base += SPEED * dt;
      if (base > bounds.to) base = bounds.from;

      bodies.forEach((r, i) => {
        const vmax = (4 * 60) / (r.stride * (1 - CONTACT));
        r.t += dt;
        if (r.air) {
          const s = Math.min(r.t / r.dur, 1);
          r.y = -4 * r.h * s * (1 - s);
          r.vy = (-4 * r.h * (1 - 2 * s)) / r.dur;
          if (s >= 1) {
            // Landing: the body splats, jiggles, and throws dust behind.
            r.air = false;
            r.t = 0;
            r.squash.v -= 5 + Math.abs(r.vy) * 0.004;
            r.lean.v += 70;
            r.y = r.vy = 0;
            kick(worldX(i) - 60, 2);
          }
        } else if (r.t >= r.stride * CONTACT) {
          r.air = true;
          r.t = 0;
          r.h = rand(42, 78);
          r.dur = r.stride * (1 - CONTACT) * Math.sqrt(r.h / 60);
          r.squash.v += 4.5;
          if (Math.random() < 0.4) kick(worldX(i) - 40, 1);
        }
        const crouch = r.t > r.stride * CONTACT * 0.55 ? 0.84 : 1;
        const shape = r.air ? 1 + (0.12 * Math.abs(r.vy)) / vmax : crouch;
        pull(r.squash, shape, 520, 13, dt);
        pull(r.lean, REST_LEAN + (r.air ? (8 * r.vy) / vmax : 0), 180, 9, dt);
      });

      const grip = GROUND + carrier.y - (212 - SIGN_GRIP.y);
      pull(signY, grip, 60, 14, dt);
      pull(signTilt, SIGN_LEAN + clamp(signY.v * 0.01, -3, 3), 60, 13, dt);

      for (const p of puffs) {
        if (!p.live) continue;
        p.age += dt;
        p.vx *= 1 - 1.4 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.age >= p.life) p.live = false;
      }
    };

    const draw = () => {
      bodies.forEach((r, i) => {
        const sy = r.squash.x;
        const sx = 1 + (1 - sy) * 0.85;
        const x = worldX(i);
        r.el.setAttribute(
          "transform",
          `translate(${x} ${GROUND + r.y}) rotate(${r.lean.x}) scale(${sx} ${sy}) translate(-110 -212)`,
        );
        const lift = clamp(-r.y / 140, 0, 0.55);
        r.shadow.setAttribute(
          "transform",
          `translate(${x - 4} ${GROUND}) scale(${1 - lift} 1)`,
        );
        r.shadow.setAttribute("opacity", `${1 - lift}`);
      });
      const i = bodies.indexOf(carrier);
      const gx = worldX(i) - 110 + SIGN_GRIP.x;
      sign.setAttribute(
        "transform",
        `translate(${gx} ${signY.x}) rotate(${signTilt.x}) translate(${-SIGN_FOOT.x} ${-SIGN_FOOT.y})`,
      );
      for (const p of puffs) {
        const u = p.age / p.life;
        const fade = u < 0.12 ? u / 0.12 : Math.pow(1 - u, 1.3);
        const grow = p.size * (0.5 + 0.8 * (1 - Math.pow(1 - u, 3)));
        p.el.setAttribute("opacity", p.live ? `${p.peak * fade}` : "0");
        if (p.live)
          p.el.setAttribute(
            "transform",
            `translate(${p.x} ${p.y}) scale(${grow})`,
          );
      }
    };

    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 1 / 20);
      last = now;
      bounds = lapBounds();
      const steps = Math.ceil(dt / SUBSTEP);
      for (let n = 0; n < steps; n++) simulate(dt / steps);
      draw();
      frame = requestAnimationFrame(tick);
    };

    io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (entry?.isIntersecting) frame = requestAnimationFrame(tick);
    });
    io.observe(svg);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    io?.disconnect();
  });
}
