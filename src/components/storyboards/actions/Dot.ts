import * as d3 from "d3";
import { AbstractAction, Coordinate } from "./AbstractAction";
import { ActionEnum } from "./ActionEnum";

export type DotProperties = {
  id?: string;
  size?: number;
  color?: string;
  opacity?: number;
};

export const defaultDotProperties: DotProperties = {
  id: "Dot",
  size: 5,
  color: "#000000",
  opacity: 1,
};

export class Dot extends AbstractAction {
  protected _properties: DotProperties;
  protected _dotNode;

  constructor() {
    super();
    this._type = ActionEnum.DOT;
  }

  public properties(properties: DotProperties = {}) {
    this._properties = { ...defaultDotProperties, ...properties };
    return this;
  }

  public draw() {
    this._dotNode = d3
      .create("svg")
      .append("circle")
      .attr("r", this._properties.size)
      .attr("fill", this._properties.color)
      .attr("opacity", this._properties.opacity)
      .node();
    this._node.appendChild(this._dotNode);

    return this;
  }

  public coordinate(src: Coordinate, dest: Coordinate) {
    const [x1, y1] = (this._src = src);
    const [x2, y2] = (this._dest = dest);

    d3.select(this._dotNode).attr("cx", x2).attr("cy", y2);

    return this;
  }
}
