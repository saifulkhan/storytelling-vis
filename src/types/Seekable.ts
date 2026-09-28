/**
 * Minimal interface for anything that can be driven to a discrete story
 * step, e.g., by a scroll-driven UI (plots implement it structurally).
 */
export interface Seekable {
  /**
   * Reveal the story up to the given timeline action index. A negative
   * index resets to the initial state; an index past the last action
   * reveals the remaining tail of the story.
   */
  animateTo(index: number): unknown;
}
