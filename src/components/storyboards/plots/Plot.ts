import { Coordinate } from "../actions/Action";

export type PlotProperties = {
  title?: string;
  ticks?: boolean;
  xLabel?: string;
  rightAxisLabel?: string;
  leftAxisLabel?: string;
};

export const defaultPlotProperties: PlotProperties = {
  title: "title...",
  ticks: true,
  xLabel: "x axis label...",
  rightAxisLabel: "right axis label...",
  leftAxisLabel: "left axis label...",
};

export abstract class Plot {
  protected svg: SVGSVGElement;
  protected node: HTMLElement;

  constructor() {}
  public abstract setData(...args: unknown[]): this;
  public abstract setPlotProperties(properties: unknown): this;
  public abstract setName(properties: unknown): this;
  // public abstract plotProperties(properties: unknown): this;
  public abstract setSvg(svg: SVGSVGElement): this;
  public abstract draw();
  public abstract setActions(any): this;
  public abstract animate();
  public abstract getCoordinates(...args: unknown[]): [Coordinate, Coordinate];
}
