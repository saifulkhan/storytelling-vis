import { Seekable } from '../../types';

/**
 * ScrollStoryController drives one or more seekable plots to a discrete
 * story step, e.g., from a scrollable storyboard UI, without depending on
 * any specific framework. The scrollable container (React, plain DOM,
 * etc.) computes the in-focus step and calls `seek()`.
 */
export class ScrollStoryController {
  private plots: Seekable[];
  private currentIndex: number | null = null;

  constructor(plots: Seekable[]) {
    this.plots = plots;
  }

  /**
   * Animate all plots to the given timeline action index; repeated calls
   * with the same index are ignored.
   */
  seek(index: number): void {
    if (this.currentIndex === index) {
      return;
    }
    this.currentIndex = index;
    this.plots.forEach((plot) => plot.animateTo(index));
  }

  getCurrentIndex(): number | null {
    return this.currentIndex;
  }

  /** reset all plots to their initial state, before the first action */
  reset(): void {
    this.currentIndex = null;
    this.plots.forEach((plot) => plot.animateTo(-1));
  }

  updatePlots(plots: Seekable[]): void {
    this.plots = plots;
  }
}
