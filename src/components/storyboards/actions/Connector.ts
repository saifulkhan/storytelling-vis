import * as d3 from "d3";
import { Action, Coordinate } from "./Action";
import { Actions } from "./Actions";

export type ConnectorProperties = {
  id?: string;
  stroke?: string;
  opacity?: number;
};

export const defaultConnectorProperties: ConnectorProperties = {
  id: "Connector",
  stroke: "#000000",
  opacity: 1,
};

export class Connector extends Action {
  protected _properties: ConnectorProperties;
  protected _connectorNode;
  protected _x0: number;
  protected _y0: number;

  constructor() {
    super();
    this._type = Actions.CONNECTOR;
  }

  public properties(properties: ConnectorProperties = {}) {
    this._properties = { ...defaultConnectorProperties, ...properties };
    return this;
  }

  public draw() {
    this._connectorNode = d3
      .create("svg")
      .append("line")
      .attr("stroke", this._properties.stroke)
      .attr("opacity", this._properties.opacity)
      .style("stroke-dasharray", "5,5")
      .node();
    this._node.appendChild(this._connectorNode);

    return this;
  }

  public coordinate(coordinate: [Coordinate, Coordinate]): this {
    const [x1, y1] = coordinate[0];
    const [x2, y2] = coordinate[1];

    d3.select(this._connectorNode)
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2);

    return this;
  }
}
