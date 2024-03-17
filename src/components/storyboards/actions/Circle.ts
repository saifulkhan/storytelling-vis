import * as d3 from "d3";
import { Action, Coordinate } from "./Action";
import { Actions } from "./Actions";

export type CircleProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
};

export const defaultCircleProps: CircleProps = {
  size: 10,
  strokeWidth: 2,
  color: "#000000",
  opacity: 1,
};

export class Circle extends Action {
  protected props: CircleProps;
  protected circleNode: any;

  constructor() {
    super();
    this.type = Actions.CIRCLE;
  }

  public setProps(properties: CircleProps = {}) {
    this.props = { ...defaultCircleProps, ...properties };
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    this.canvas();
    this.draw();
    return this;
  }

  protected draw() {
    this.circleNode = d3
      .create("svg")
      .append("circle")
      .attr("fill", "none")
      .attr("r", this.props.size)
      .attr("stroke-width", this.props.strokeWidth)
      .attr("stroke", this.props.color)
      .attr("opacity", this.props.opacity)
      .node();
    this.node.appendChild(this.circleNode);
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]): this {
    this.coordinate0 = coordinate[0];
    this.coordinate1 = coordinate[1];

    d3.select(this.circleNode)
      .attr("cx", this.coordinate1[0])
      .attr("cy", this.coordinate1[1]);

    return this;
  }

  public updateProps(properties: any): this {
    throw new Error("Circle: updateProps () is not implemented!");
  }
  public move(
    coordinate: Coordinate,
    delay?: number | undefined,
    duration?: number | undefined
  ): Promise<any> {
    throw new Error("Circle: move() not implemented!");
  }
}
