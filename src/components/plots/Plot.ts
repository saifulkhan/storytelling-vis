import * as d3 from 'd3';
import { Coordinate } from '../../types';

export type PlotProps = {
  title?: string;
  ticks?: boolean;
  xLabel?: string;
  rightAxisLabel?: string;
  leftAxisLabel?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const defaultPlotProps: PlotProps = {
  title: 'title...',
  ticks: true,
  xLabel: 'x axis label...',
  rightAxisLabel: 'right axis label...',
  leftAxisLabel: 'left axis label...',
  margin: { top: 50, right: 50, bottom: 60, left: 60 },
};

export abstract class Plot {
  protected svg: SVGSVGElement | undefined;
  protected node: any;

  protected animationRef: number | null = null;
  protected isPlayingRef: { current: boolean } = { current: false };
  protected lastAction: any = null;
  protected playActionIdx: number = 0;

  constructor() {}

  public abstract setData(...args: unknown[]): this;
  public abstract setPlotProps(props: PlotProps): this;
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
}
