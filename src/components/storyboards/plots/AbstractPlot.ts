import { Coordinate } from "../actions/AbstractAction";

export abstract class AbstractPlot {
  protected _svg: SVGSVGElement;
  protected _node: HTMLElement;

  constructor() {
    //
  }
  public abstract data(...args: unknown[]);
  public abstract chartProperties(p: unknown);
  public abstract svg(svg: SVGSVGElement);
  public abstract draw();
  public abstract coordinates(...args: unknown[]): [Coordinate, Coordinate];
}
