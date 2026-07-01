/** Shared motion presets — fast, smooth transitions */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const VIEW_IN = {
  duration: 0.35,
  ease: EASE_OUT,
} as const;

export const VIEW_IN_FAST = {
  duration: 0.25,
  ease: EASE_OUT,
} as const;

export const STAGGER_STEP = 0.035;

export const PAGE_EXIT = {
  duration: 0.28,
  ease: EASE_OUT,
} as const;
