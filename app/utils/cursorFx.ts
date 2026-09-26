type Point = { x: number; y: number };
type Print = Point & { angle: number; born: number };

const PRINT_LIFE = 900;
const DASH = [9, 11];

export function createFx(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const prints: Print[] = [];

  const resize = () => {
    const dpr = devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const step = (x: number, y: number, angle: number) =>
    prints.push({ x, y, angle, born: performance.now() });

  const drawPrints = (ink: string, now: number) => {
    ctx.fillStyle = ink;
    for (let i = prints.length - 1; i >= 0; i--) {
      const p = prints[i]!;
      const life = 1 - (now - p.born) / PRINT_LIFE;
      if (life <= 0) {
        prints.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = 0.6 * life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.5 * (0.6 + life * 0.4), 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const drawLeash = (ink: string, path: Point[], offset: number) => {
    if (path.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(path[0]!.x, path[0]!.y);
    for (let i = 1; i < path.length - 1; i++) {
      const [p, n] = [path[i]!, path[i + 1]!];
      ctx.quadraticCurveTo(p.x, p.y, (p.x + n.x) / 2, (p.y + n.y) / 2);
    }
    ctx.lineTo(path.at(-1)!.x, path.at(-1)!.y);
    ctx.setLineDash(DASH);
    ctx.lineDashOffset = offset;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const draw = (ink: string, path: Point[], offset: number) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    drawLeash(ink, path, offset);
    drawPrints(ink, performance.now());
    return prints.length > 0;
  };

  return { resize, step, draw };
}
