export const EASE = {
  // Primary UI easing — confident, slightly anticipatory
  signature: "cubic-bezier(0.16, 1, 0.3, 1)",       // GSAP custom ease "expo.out"-like but tuned
  // Snappy, for micro-interactions (button press, toggle)
  snap: "cubic-bezier(0.34, 1.56, 0.64, 1)",         // overshoot ease — slight bounce-back, NOT cartoonish
  // Cinematic, for hero/scroll-triggered reveals
  cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
  // Soft settle, for modals/panels
  settle: "cubic-bezier(0.32, 0.72, 0, 1)",
  // Card hover lift
  lift: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

export const DURATION = {
  instant: 0.15,
  fast: 0.28,
  base: 0.45,
  slow: 0.7,
  cinematic: 1.2,
  heroEntrance: 1.8,
};

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
  cards: 0.1,
};
