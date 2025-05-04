/**
 * PlayPauseController provides functionality to control play/pause state
 * for animation objects without depending on any specific framework.
 */
export class PlayPauseController {
  private isPlaying: boolean = false;
  private plots: any;

  constructor(controlledObject: any) {
    this.plots = controlledObject;

    // Set the onPauseCallback if the plot supports it
    if (this.plots && typeof this.plots.setOnPauseCallback === 'function') {
      this.plots.setOnPauseCallback(() => this.pause());
    }
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.plots.play();
    } else {
      this.plots.pause();
    }
  }

  pause(): void {
    this.isPlaying = false;
    this.plots.pause();
  }

  play(): void {
    this.isPlaying = true;
    this.plots.play();
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  cleanup(): void {
    this.pause();
  }
}
