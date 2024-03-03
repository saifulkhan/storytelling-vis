import * as d3 from "d3";
import { ActionEnum, ActionEnumZOrder } from "./ActionEnum";

export type ActionsType = AbstractAction[];
export type Coordinate = [number, number];

export abstract class AbstractAction {
  protected _type: ActionEnum;
  protected _properties;
  protected _svg: SVGGElement;
  protected _node: SVGGElement;
  protected _src;
  protected _dest;

  constructor() {
    //
  }

  public abstract properties(properties: unknown);

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
      // .attr("display", "none") // hide
      .style("opacity", 0) // hide
      .node();

    d3.select(this._svg).append(() => this._node);
    return this;
  }

  public abstract draw();
  public abstract coordinate(src: Coordinate, dest: Coordinate);

  public show(delay = 2000, duration = 1000) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this._node)
        .transition()
        .delay(0) // delay before transition
        .duration(duration) // duration of the opacity transition
        .style("opacity", 1)
        .transition()
        .delay(delay) // delay after the opacity transition ends
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

  public remove() {
    // TODO: use id?
    //d3.select(svg).select("svg").remove();
    return this;
  }

  public static svg(actions: ActionsType, svg) {
    actions.map((d: AbstractAction) => d.svg(svg));
    return this;
  }

  public static draw(actions: ActionsType) {
    actions.sort(
      (a: AbstractAction, b: AbstractAction) =>
        ActionEnumZOrder[b.type] - ActionEnumZOrder[a.type],
    );
    actions.map((d: AbstractAction) => d.draw());
    return this;
  }

  public static coordinate(
    actions: ActionsType,
    src: Coordinate,
    dest: Coordinate,
  ) {
    actions.map((d: AbstractAction) => d.coordinate(src, dest));
    return this;
  }

  public static show(actions: ActionsType): Promise<any[]> {
    const promises = actions.map((d: AbstractAction) => d.show());
    return Promise.all(promises);
  }

  public static hide(actions: ActionsType) {
    const promises = actions.map((d: AbstractAction) => d.hide());
    return Promise.all(promises);
  }
}
