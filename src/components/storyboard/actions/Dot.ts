import * as d3 from "d3";
import { MSBAction } from "./MSBAction";
import { Coordinate } from "src/types/coordinate";
import { MSBActionName } from "./MSBActionName";

export type DotProps = {
  size?: number;
  color?: string;
  opacity?: number;
};

export const defaultDotProps: DotProps = {
  size: 5,
  color: "#000000",
  opacity: 1,
};

export class Dot extends MSBAction {
  protected props: DotProps = defaultDotProps;
  protected dotNode: any;

  constructor() {
    super();
    this.type = MSBActionName.DOT;
  }

  public setProps(props: DotProps = {}) {
    this.props = { ...defaultDotProps, ...props };
    return this;
  }
  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    this.canvas();
    this.draw();
    return this;
  }

  protected draw() {
    this.dotNode = d3
      .create("svg")
      .append("circle")
      .attr("r", this.props.size)
      .attr("fill", this.props.color)
      .attr("opacity", this.props.opacity)
      .node();

    this.node.appendChild(this.dotNode);

    return this;
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]): this {
    this.coordinate0 = coordinate[0];
    this.coordinate1 = coordinate[1];

    d3.select(this.dotNode)
      .attr("cx", this.coordinate1[0])
      .attr("cy", this.coordinate1[1]);

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
    throw new Error("Dot: move() not implemented!");
  }
}
