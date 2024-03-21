import * as d3 from "d3";
import { Action, Coordinate } from "./Action";
import { ActionType } from "./ActionType";

export type ConnectorProps = {
  stroke?: string;
  opacity?: number;
};

export const defaultConnectorProperties: ConnectorProps = {
  stroke: "#000000",
  opacity: 1,
};

export class Connector extends Action {
  protected props: ConnectorProps;
  protected connectorNode: nay;

  constructor() {
    super();
    this.type = ActionType.CONNECTOR;
  }

  public setProps(properties: ConnectorProps = {}) {
    this.props = { ...defaultConnectorProperties, ...properties };
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    this.canvas();
    this.draw();
    return this;
  }

  protected draw() {
    this.connectorNode = d3
      .create("svg")
      .append("line")
      .attr("stroke", this.props.stroke)
      .attr("opacity", this.props.opacity)
      .style("stroke-dasharray", "5,5")
      .node();
    this.node.appendChild(this.connectorNode);

    return this;
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]): this {
    this.coordinate0 = coordinate[0];
    this.coordinate1 = coordinate[1];

    d3.select(this.connectorNode)
      .attr("x1", this.coordinate0[0])
      .attr("y1", this.coordinate0[1])
      .attr("x2", this.coordinate1[0])
      .attr("y2", this.coordinate1[1]);

    return this;
  }

  public updateProps(properties: any): this {
    return this;
  }
  public move(
    coordinate: Coordinate,
    delay?: number | undefined,
    duration?: number | undefined
  ): Promise<any> {
    throw new Error("Connector: move() not implemented!");
  }
}
