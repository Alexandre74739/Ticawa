<template>
  <svg
    ref="svg"
    aria-hidden="true"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    class="pointer-events-none absolute inset-0 -z-10 size-full mask-[radial-gradient(ellipse_at_center,transparent_25%,black_70%)]"
  >
    <defs>
      <filter
        :id="`${uid}-blur`"
        filterUnits="userSpaceOnUse"
        x="-500"
        y="-500"
        width="2440"
        height="1900"
      >
        <feGaussianBlur ref="blur" stdDeviation="0" />
      </filter>
      <mask
        :id="`${uid}-hole`"
        maskUnits="userSpaceOnUse"
        x="-500"
        y="-500"
        width="2440"
        height="1900"
      >
        <rect x="-500" y="-500" width="2440" height="1900" fill="white" />
        <g ref="hole" :filter="`url(#${uid}-blur)`" opacity="0">
          <path
            ref="trail"
            fill="none"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle ref="tico" fill="black" />
          <circle ref="dot" fill="black" />
        </g>
      </mask>
    </defs>

    <g :mask="`url(#${uid}-hole)`">
      <path
        v-for="(d, i) in initial"
        :key="i"
        :ref="(el) => (paths[i] = el as SVGPathElement)"
        :d="d"
        stroke-width="1.5"
        vector-effect="non-scaling-stroke"
        class="stroke-indigo/25"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { cursorShape } from "~/composables/useCursor";

const POINTS = 56;
const SIGMA = 110;
const PUSH = 55;
const DRAG = 2.2;
const SPRING = 0.06;
const DAMPING = 0.86;
const GAP = { trail: 44, tico: 64, dot: 44, blur: 10 };

type Ring = {
  cx: number;
  cy: number;
  r: number;
  amp: number;
  seed: number;
  phase: number;
};
type Point = [number, number];

const hill = (cx: number, cy: number, drift: number, seed: number): Ring[] =>
  Array.from({ length: 10 }, (_, j) => ({
    cx: cx + j * drift,
    cy: cy + j * drift * 0.6,
    r: 50 + j * 58 + 16 * Math.sin(j * 1.7 + seed),
    amp: 0.15 + j * 0.014,
    seed: seed + j * 0.2,
    phase: j * 0.4,
  }));

const RINGS = [...hill(140, 150, 9, 0), ...hill(1320, 790, -9, 2.4)];

const round = (n: number) => Math.round(n * 10) / 10;

const shape = (ring: Ring, t: number): Point[] => {
  const s = ring.seed + 0.6 * Math.sin(t * 0.00045 + ring.phase);
  const breathe = 1 + 0.025 * Math.sin(t * 0.0007 + ring.phase * 1.3);
  const cx = ring.cx + 14 * Math.sin(t * 0.00025 + ring.phase);
  const cy = ring.cy + 10 * Math.cos(t * 0.0003 + ring.phase);
  return Array.from({ length: POINTS }, (_, i) => {
    const a = (i / POINTS) * Math.PI * 2;
    const k =
      breathe +
      ring.amp *
        (0.5 * Math.sin(2 * a + s) +
          0.3 * Math.sin(3 * a - 1.3 * s) +
          0.2 * Math.sin(a + 2 * s));
    return [cx + Math.cos(a) * ring.r * k, cy + Math.sin(a) * ring.r * k];
  });
};

const toPath = (pts: Point[]) => {
  const at = (i: number) => pts[(i + POINTS) % POINTS]!;
  let d = `M${at(0).map(round).join(" ")}`;
  for (let i = 0; i < POINTS; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${[...c1, ...c2, ...p2].map(round).join(" ")}`;
  }
  return `${d}Z`;
};

const initial = RINGS.map((ring) => toPath(shape(ring, 0)));

const uid = useId();
const svg = ref<SVGSVGElement | null>(null);
const hole = ref<SVGGElement | null>(null);
const blur = ref<SVGFEGaussianBlurElement | null>(null);
const trail = ref<SVGPathElement | null>(null);
const tico = ref<SVGCircleElement | null>(null);
const dot = ref<SVGCircleElement | null>(null);
const paths: SVGPathElement[] = [];
let cleanup = () => {};

onMounted(() => {
  const [el, group, fade, line, head, tip] = [
    svg.value,
    hole.value,
    blur.value,
    trail.value,
    tico.value,
    dot.value,
  ];
  if (
    !el ||
    !group ||
    !fade ||
    !line ||
    !head ||
    !tip ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  const cursor = { x: 0, y: 0, vx: 0, vy: 0, force: 0 };
  const target = { x: 0, y: 0, force: 0 };
  const pointer = { x: 0, y: 0 };
  let opacity = 0;
  const springs = RINGS.map(() => new Float32Array(POINTS * 4));
  let raf = 0;
  const start = performance.now();

  const onPointer = (e: PointerEvent) => {
    const m = el.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    if (!target.force) Object.assign(cursor, { x: p.x, y: p.y });
    Object.assign(target, { x: p.x, y: p.y, force: 1 });
    Object.assign(pointer, { x: e.clientX, y: e.clientY });
  };
  const onLeave = () => (target.force = 0);

  // Cassure : épouse tout le curseur (point, trait et Tico). Sans curseur
  // personnalisé (tactile), elle se limite au point de contact.
  const drawGap = () => {
    opacity += (target.force - opacity) * 0.12;
    group.setAttribute("opacity", String(round(opacity)));
    const m = el.getScreenCTM();
    if (!m || opacity < 0.01) return;
    const inv = m.inverse();
    const k = 1 / m.a;
    const toSvg = ({ x, y }: { x: number; y: number }) =>
      new DOMPoint(x, y).matrixTransform(inv);
    const custom = cursorShape.active && cursorShape.path.length > 0;
    const pts = (custom ? cursorShape.path : [pointer]).map(toSvg);
    const from = toSvg(custom ? cursorShape.tico : pointer);
    const to = pts.at(-1)!;
    line.setAttribute(
      "d",
      `M${[from, ...pts].map((p) => `${round(p.x)} ${round(p.y)}`).join("L")}`,
    );
    line.setAttribute("stroke-width", String(round(GAP.trail * 2 * k)));
    head.setAttribute("cx", String(round(from.x)));
    head.setAttribute("cy", String(round(from.y)));
    head.setAttribute("r", String(round((custom ? GAP.tico : GAP.dot) * k)));
    tip.setAttribute("cx", String(round(to.x)));
    tip.setAttribute("cy", String(round(to.y)));
    tip.setAttribute("r", String(round(GAP.dot * k)));
    fade.setAttribute("stdDeviation", String(round(GAP.blur * k)));
  };

  const draw = (now: number) => {
    const px = cursor.x;
    const py = cursor.y;
    cursor.x += (target.x - cursor.x) * 0.2;
    cursor.y += (target.y - cursor.y) * 0.2;
    cursor.vx += (cursor.x - px - cursor.vx) * 0.3;
    cursor.vy += (cursor.y - py - cursor.vy) * 0.3;
    cursor.force += (target.force - cursor.force) * 0.06;

    drawGap();

    const t = now - start;
    RINGS.forEach((ring, i) => {
      const spring = springs[i]!;
      const pts = shape(ring, t).map(([x, y], j): Point => {
        const dx = x - cursor.x;
        const dy = y - cursor.y;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA)) * cursor.force;
        const tx = (dx / dist) * PUSH * f + cursor.vx * DRAG * f;
        const ty = (dy / dist) * PUSH * f + cursor.vy * DRAG * f;
        const o = j * 4;
        const [ox = 0, oy = 0, vx = 0, vy = 0] = spring.subarray(o, o + 4);
        const nvx = (vx + (tx - ox) * SPRING) * DAMPING;
        const nvy = (vy + (ty - oy) * SPRING) * DAMPING;
        spring.set([ox + nvx, oy + nvy, nvx, nvy], o);
        return [x + ox + nvx, y + oy + nvy];
      });
      paths[i]?.setAttribute("d", toPath(pts));
    });
    raf = requestAnimationFrame(draw);
  };

  const io = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    if (entry?.isIntersecting) raf = requestAnimationFrame(draw);
  });

  addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  io.observe(el);

  cleanup = () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("mouseleave", onLeave);
  };
});

onBeforeUnmount(() => cleanup());
</script>
