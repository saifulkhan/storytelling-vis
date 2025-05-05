/**
 * SynchronizedPlotsController provides functionality to control play/pause state
 * for multiple animation objects without depending on any specific framework.
 */
export class SynchronizedPlotsController {
  private isPlaying: boolean = false;
  private plots: any[];

  constructor(plots: any[]) {
    this.plots = plots;

    // Set the onPauseCallback on each plot if supported
    this.plots.forEach((plot) => {
      if (plot && typeof plot.setOnPauseCallback === 'function') {
        plot.setOnPauseCallback(() => this.pause());
      }
    });
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;

    this.plots.forEach((plot) => {
      if (plot && typeof plot.togglePlayPause === 'function') {
        plot.togglePlayPause();
      }
    });
  }

  pause(): void {
    this.isPlaying = false;

    this.plots.forEach((plot) => {
      if (plot && typeof plot.pause === 'function') {
        plot.pause();
      }
    });
  }

  play(): void {
    this.isPlaying = true;

    this.plots.forEach((plot) => {
      if (plot && typeof plot.play === 'function') {
        plot.play();
      }
    });
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  updatePlots(plots: any[]): void {
    this.plots = plots;
  }

  cleanup(): void {
    this.pause();
  }
}
