import { Coordinate } from "../actions/AbstractAction";

export abstract class AbstractPlot {
  protected _svg: SVGSVGElement;
  protected _node: HTMLElement;

  constructor() {
    //
  }
  public abstract data(...args: unknown[]): this;
  public abstract properties(properties: unknown): this;
  public abstract svg(svg: SVGSVGElement): this;
  public abstract draw(): this;
  public abstract animate();
  // public abstract coordinates(...args: unknown[]): [Coordinate, Coordinate];
}
