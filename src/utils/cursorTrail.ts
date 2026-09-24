type Point = { x: number; y: number };

const REST = 64;
const MIN_STEP = 4;
const MAX_SPEED = 14;
const MAX_LAG = 220;
const PACE = 0.07;
const GRIP = 0.14;

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

export function createTrail() {
  let path: Point[] = [];
  let speed = 0;
  let eaten = 0;

  const reset = (p: Point) => {
    path = [{ x: p.x - REST * 0.6, y: p.y + REST * 0.8 }, { ...p }];
    speed = 0;
  };

  const push = (p: Point) => {
    const last = path.at(-1);
    if (!last) return reset(p);
    if (path.length > 2 && dist(path.at(-2)!, p) < MIN_STEP)
      Object.assign(last, p);
    else path.push({ ...p });
  };

  const advance = (instant: boolean) => {
    const head = path[0];
    const tip = path.at(-1);
    if (!head || !tip) return null;
    if (dist(head, tip) < REST) path = [head, tip];
    let length = 0;
    for (let i = 1; i < path.length; i++)
      length += dist(path[i - 1]!, path[i]!);
    const excess = Math.max(0, length - REST);
    const hurry = Math.max(0, excess - MAX_LAG) * 0.3;
    const target = Math.min(excess * PACE, MAX_SPEED);
    speed = instant ? excess : speed + (target - speed) * GRIP;
    const from = { ...head };
    let step = Math.min(speed + hurry, excess);
    while (step > 0 && path.length > 1) {
      const seg = dist(path[0]!, path[1]!);
      if (step >= seg) {
        path.shift();
        step -= seg;
        eaten += seg;
        continue;
      }
      path[0]!.x += ((path[1]!.x - path[0]!.x) * step) / seg;
      path[0]!.y += ((path[1]!.y - path[0]!.y) * step) / seg;
      eaten += step;
      step = 0;
    }
    const to = path[0]!;
    return { x: to.x, y: to.y, dx: to.x - from.x, dy: to.y - from.y, speed };
  };

  return {
    reset,
    push,
    advance,
    get path() {
      return path;
    },
    get eaten() {
      return eaten;
    },
  };
}
