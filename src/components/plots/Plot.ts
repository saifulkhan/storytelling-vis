import * as d3 from 'd3';
import { Coordinate } from '../../types';

export abstract class Plot {
  protected svg: SVGSVGElement | undefined;
  protected node: any;

  protected animationRef: number | null = null;
  protected isPlayingRef: { current: boolean } = { current: false };
  protected lastTimelineAction: any = null;
  protected playActionIdx: number = 0;
  protected onPauseCallback: (() => void) | null = null;

  constructor() {}

  public abstract setData(...args: unknown[]): this;
  public abstract setPlotProps(props: any): this;
  public abstract setName(properties: unknown): this;
  public abstract setCanvas(svg: SVGSVGElement): this;
  public abstract plot(): void;
  public abstract setActions(unknown: unknown): this;
  public abstract getCoordinates(...args: unknown[]): [Coordinate, Coordinate];

  protected clean() {
    if (this.svg) {
      d3.select(this.svg).selectAll('*').remove();
    }
  }

  togglePlayPause() {
    this.isPlayingRef.current = !this.isPlayingRef.current;
  }

  animate(): void {
    return;
  }

  play() {
    this.isPlayingRef.current = true;
    this.animate();
  }

  pause() {
    this.isPlayingRef.current = false;

    if (this.animationRef) {
      cancelAnimationFrame(this.animationRef);
    }
  }

  /**
   * Sets a callback function to be called when the animation is paused automatically
   * due to a pause action in the timeline.
   * @param callback The function to call when auto-paused
   */
  setOnPauseCallback(callback: () => void) {
    this.onPauseCallback = callback;
    return this;
  }
}
