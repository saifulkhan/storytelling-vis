import { Coordinate } from "../actions/Action";

export abstract class Plot {
  protected _svg: SVGSVGElement;
  protected _node: HTMLElement;

  constructor() {
    //
  }
  public abstract data(...args: unknown[]): this;
  public abstract properties(properties: unknown): this;
  public abstract svg(svg: SVGSVGElement): this;
  public abstract draw();
  // public abstract coordinates(...args: unknown[]): [Coordinate, Coordinate];
}
