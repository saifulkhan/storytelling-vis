/**
 * SynchronizedPlotsController provides functionality to control play/pause state
 * for multiple animation objects without depending on any specific framework.
 */
export class SynchronizedPlotsController {
  private isPlaying: boolean = false;
  private plots: any[];

  /**
   * Create a new SynchronizedPlotsController
   * @param plots - Array of objects that implement play(), pause(), and togglePlayPause() methods
   */
  constructor(plots: any[]) {
    this.plots = plots;
  }

  /**
   * Toggle between play and pause states for all plots
   */
  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;

    this.plots.forEach((plot) => {
      if (plot && typeof plot.togglePlayPause === 'function') {
        plot.togglePlayPause();
      }
    });
  }

  /**
   * Force pause state for all plots
   */
  pause(): void {
    this.isPlaying = false;

    this.plots.forEach((plot) => {
      if (plot && typeof plot.pause === 'function') {
        plot.pause();
      }
    });
  }

  /**
   * Force play state for all plots
   */
  play(): void {
    this.isPlaying = true;

    this.plots.forEach((plot) => {
      if (plot && typeof plot.play === 'function') {
        plot.play();
      }
    });
  }

  /**
   * Get current playing state
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Update the list of plots to be synchronized
   */
  updatePlots(plots: any[]): void {
    this.plots = plots;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.pause();
  }
}
