import { Coordinate } from "../actions/Action";

export type PlotProps = {
  title?: string;
  ticks?: boolean;
  xLabel?: string;
  rightAxisLabel?: string;
  leftAxisLabel?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const defaultPlotProps: PlotProps = {
  title: "title...",
  ticks: true,
  xLabel: "x axis label...",
  rightAxisLabel: "right axis label...",
  leftAxisLabel: "left axis label...",
  margin: { top: 50, right: 50, bottom: 60, left: 60 },
};

export abstract class Plot {
  protected svg: SVGSVGElement;
  protected node: any;

  constructor() {}
  public abstract setData(...args: unknown[]): this;
  public abstract setPlotProps(props: PlotProps): this;
  public abstract setName(properties: unknown): this;
  public abstract setCanvas(svg: SVGSVGElement): this;
  public abstract draw();
  public abstract setActions(unknown): this;
  public abstract animate();
  public abstract getCoordinates(...args: unknown[]): [Coordinate, Coordinate];
}
