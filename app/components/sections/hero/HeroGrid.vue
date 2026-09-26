<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="absolute inset-0 size-full mask-[radial-gradient(ellipse_at_center,black_30%,transparent_85%)]"
  />
</template>

<script setup lang="ts">
const CELL = 64;
const STEP = 16;
const AMP = 3;

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

  const wave = (along: number, across: number, t: number) =>
    AMP * Math.sin(along * 0.012 + across * 0.02 + t * 0.0006);

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.16 + 0.03 * Math.sin(t * 0.0015);
    ctx.beginPath();
    for (let y = 0; y <= h + CELL; y += CELL)
      for (let x = 0; x <= w + STEP; x += STEP)
        (x ? ctx.lineTo : ctx.moveTo).call(ctx, x, y + wave(x, y, t));
    for (let x = 0; x <= w + CELL; x += CELL)
      for (let y = 0; y <= h + STEP; y += STEP)
        (y ? ctx.lineTo : ctx.moveTo).call(ctx, x + wave(y, x, t), y);
    ctx.stroke();
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
