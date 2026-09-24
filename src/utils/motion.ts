export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp = (delay = 0, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
});

export const float = (distance = 8, duration = 6) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
});

export const revealOnScroll = (delay = 0, y = 32) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true, margin: "0px 0px -15% 0px" as const },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
});
