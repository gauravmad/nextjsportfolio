/**
 * Mutable values the DOM writes and the WebGL frame loop reads. A plain object
 * (not React state) so scroll and pointer updates never trigger re-renders.
 */
export const sceneState = {
  /** 0 → 1 as the hero scrolls out of view. */
  progress: 0,
  /** Pointer position, -1 → 1 on both axes. */
  pointerX: 0,
  pointerY: 0,
};
