import * as d3 from "d3";
import { ActionEnum, ActionEnumZOrder } from "./ActionEnum";

export type Coordinate = [number, number];

export abstract class AbstractAction {
  protected _type: ActionEnum;
  protected _properties;
  protected _svg: SVGGElement;
  protected _node: SVGGElement;
  protected _src;
  protected _dest;

  constructor() {}

  public abstract properties(properties: unknown): this;

  public get id(): string {
    return this._properties?.id;
  }

  public get type(): ActionEnum {
    return this._type;
  }

  public svg(svg: SVGGElement) {
    this._svg = svg;
    this._node = d3
      .create("svg")
      .append("g")
      .attr("id", this._properties?.id)
      // hide option 1
      // .attr("display", "none")
      // hide option 2
      .style("opacity", 0)
      .node();

    d3.select(this._svg).append(() => this._node);
    return this;
  }

  public abstract draw(): this;
  // we need src & dest both for connector, text box
  public abstract coordinate(src: Coordinate, dest: Coordinate): this;

  public show(delay = 2000, duration = 1000) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this._node)
        .transition()
        // delay before transition
        .delay(0)
        // duration of the opacity transition
        .duration(duration)
        .style("opacity", 1)
        .transition()
        // delay after the opacity transition ends
        .delay(delay)
        .on("end", () => {
          resolve(delay + duration);
        });
    });
  }

  public hide(delay = 0, duration = 1000) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this._node)
        .transition()
        .delay(0)
        .duration(duration)
        .style("opacity", 0)
        .on("end", () => {
          resolve(delay + duration);
        });
    });
  }

  public abstract move(
    dest: Coordinate,
    delay: number,
    duration: number
  ): Promise<any>;

  public remove() {
    // TODO: not implemented; use id?
    //d3.select(svg).select("svg").remove();
    return this;
  }
}
