/**
 * PlayPauseController provides functionality to control play/pause state
 * for animation objects without depending on any specific framework.
 */
export class PlayPauseController {
  private isPlaying: boolean = false;
  private controlledObject: any;

  /**
   * Create a new PlayPauseController
   * @param controlledObject - Object that implements play(), pause(), and togglePlayPause() methods
   */
  constructor(controlledObject: any) {
    this.controlledObject = controlledObject;
  }

  /**
   * Toggle between play and pause states
   */
  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.controlledObject.play();
    } else {
      this.controlledObject.pause();
    }
  }

  /**
   * Force pause state
   */
  pause(): void {
    this.isPlaying = false;
    this.controlledObject.pause();
  }

  /**
   * Force play state
   */
  play(): void {
    this.isPlaying = true;
    this.controlledObject.play();
  }

  /**
   * Get current playing state
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.pause();
  }
}
 