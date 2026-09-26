type Point = { x: number; y: number };
type Stamp = Point & { at: number };
export type Flash = "dizzy" | "surprised" | "happy";

const SPIN = { turns: 3, within: 2000, minStep: 10, maxTurn: 2, size: 120 };
const FLICK = { rest: 300, distance: 550, within: 130 };
const PET = { radius: 34, strokes: 4, within: 1500 };

const TAU = Math.PI * 2;

export function createMoodTriggers(fire: (flash: Flash) => void) {
  let anchor: Stamp | null = null;
  let heading: number | null = null;
  let turns: (Stamp & { angle: number })[] = [];
  let last: Stamp | null = null;
  let burst: Stamp | null = null;
  let strokes: number[] = [];
  let petDir = 0;

  const spin = (p: Stamp) => {
    if (!anchor) return (anchor = p);
    const dx = p.x - anchor.x;
    const dy = p.y - anchor.y;
    if (Math.hypot(dx, dy) < SPIN.minStep) return;
    const h = Math.atan2(dy, dx);
    if (heading !== null) {
      const angle = ((h - heading + Math.PI * 3) % TAU) - Math.PI;
      if (Math.abs(angle) < SPIN.maxTurn) turns.push({ ...p, angle });
    }
    heading = h;
    anchor = p;
    turns = turns.filter((t) => p.at - t.at < SPIN.within);
    const total = turns.reduce((sum, t) => sum + t.angle, 0);
    const xs = turns.map((t) => t.x);
    const ys = turns.map((t) => t.y);
    const wide =
      Math.max(...xs) - Math.min(...xs) >= SPIN.size &&
      Math.max(...ys) - Math.min(...ys) >= SPIN.size;
    if (wide && Math.abs(total) >= SPIN.turns * TAU) {
      turns = [];
      fire("dizzy");
    }
  };

  const flick = (p: Stamp) => {
    if (last && p.at - last.at >= FLICK.rest) burst = { ...last, at: p.at };
    last = p;
    if (!burst) return;
    if (p.at - burst.at > FLICK.within) return (burst = null);
    if (Math.hypot(p.x - burst.x, p.y - burst.y) >= FLICK.distance) {
      burst = null;
      fire("surprised");
    }
  };

  const pet = (p: Stamp, dx: number, tico: Point) => {
    if (Math.hypot(p.x - tico.x, p.y - tico.y) > PET.radius) return;
    const dir = Math.sign(dx);
    if (!dir || Math.abs(dx) < 2 || dir === petDir) return;
    petDir = dir;
    strokes = strokes.filter((at) => p.at - at < PET.within);
    strokes.push(p.at);
    if (strokes.length >= PET.strokes) {
      strokes = [];
      fire("happy");
    }
  };

  const move = (x: number, y: number, dx: number, tico: Point) => {
    const p = { x, y, at: performance.now() };
    spin(p);
    flick(p);
    pet(p, dx, tico);
  };

  const reset = () => {
    anchor = heading = null;
    turns = [];
    last = burst = null;
  };

  return { move, reset };
}
