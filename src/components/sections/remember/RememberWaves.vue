<template>
  <canvas ref="canvas" aria-hidden="true" class="size-full" />
</template>

<script setup lang="ts">
const RINGS = [
  { size: 0.28, alpha: 0.35, seed: 0 },
  { size: 0.35, alpha: 0.24, seed: 2.1 },
  { size: 0.42, alpha: 0.14, seed: 4.3 },
];
const STEPS = 160;

const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let cleanup = () => {};

onMounted(() => {
  const el = canvas.value!;
  const ctx = el.getContext("2d")!;
  const color =
    getComputedStyle(el).getPropertyValue("--color-paper").trim() || "#fbf9f5";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0;
  let h = 0;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    w = el.clientWidth;
    h = el.clientHeight;
    el.width = w * dpr;
    el.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  };

  const wobble = (a: number, t: number, s: number) =>
    1 +
    0.06 * Math.sin(3 * a + t * 0.0005 + s) +
    0.04 * Math.sin(5 * a - t * 0.0007 + s * 1.7) +
    0.025 * Math.sin(2 * a + t * 0.0003 - s);

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const base = Math.min(w, h);
    for (const ring of RINGS) {
      ctx.globalAlpha = ring.alpha;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const a = (i / STEPS) * Math.PI * 2;
        const r = base * ring.size * wobble(a, t, ring.seed);
        ctx.lineTo(w / 2 + r * Math.cos(a), h / 2 + r * Math.sin(a));
      }
      ctx.stroke();
    }
  }

  const loop = (t: number) => {
    draw(t);
    raf = requestAnimationFrame(loop);
  };

  const io = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    if (entry?.isIntersecting && !reduced) raf = requestAnimationFrame(loop);
  });
  const ro = new ResizeObserver(resize);
  io.observe(el);
  ro.observe(el);

  cleanup = () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
  };
});

onBeforeUnmount(() => cleanup());
</script>
