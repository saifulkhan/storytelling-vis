import * as d3 from "d3";
import { AbstractAction, Coordinate } from "./AbstractAction";
import { ActionEnum } from "./ActionEnum";

export type CircleProperties = {
  id?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
};

export const defaultCircleProperties: CircleProperties = {
  id: "Circle",
  size: 10,
  strokeWidth: 2,
  color: "#000000",
  opacity: 1,
};

export class Circle extends AbstractAction {
  protected _properties: CircleProperties;
  protected _circleNode;

  constructor() {
    super();
    this._type = ActionEnum.CIRCLE;
  }

  public properties(properties: CircleProperties = {}) {
    this._properties = { ...defaultCircleProperties, ...properties };
    return this;
  }

  public draw() {
    this._circleNode = d3
      .create("svg")
      .append("circle")
      .attr("fill", "none")
      .attr("r", this._properties.size)
      .attr("stroke-width", this._properties.strokeWidth)
      .attr("stroke", this._properties.color)
      .attr("opacity", this._properties.opacity)
      .node();
    this._node.appendChild(this._circleNode);

    return this;
  }

  public coordinate(src: Coordinate, dest: Coordinate) {
    const [x1, y1] = (this._src = src);
    const [x2, y2] = (this._dest = dest);

    d3.select(this._circleNode).attr("cx", x2).attr("cy", y2);

    return this;
  }
}
