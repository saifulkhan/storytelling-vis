import * as d3 from 'd3';
import { ActionName } from './ActionName';
import { Action } from './Action';
import { Coordinate } from '../../types';

export type CircleProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
};

export const defaultCircleProps: CircleProps = {
  size: 10,
  strokeWidth: 2,
  color: '#000000',
  opacity: 1,
};

export class Circle extends Action {
  protected props: CircleProps = defaultCircleProps;
  protected circleNode: any;

  constructor() {
    super();
    this.type = ActionName.CIRCLE;
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

  public draw() {
    this.circleNode = d3
      .create('svg')
      .append('circle')
      .attr('fill', 'none')
      .attr('r', this.props.size!)
      .attr('stroke-width', this.props.strokeWidth!)
      .attr('stroke', this.props.color!)
      .attr('opacity', this.props.opacity!)
      .node();
    this.node.appendChild(this.circleNode);
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]): this {
    this.coordOrigin = coordinate[0];
    this.coordDestination = coordinate[1];

    d3.select(this.circleNode)
      .attr('cx', this.coordDestination[0])
      .attr('cy', this.coordDestination[1]);

    return this;
  }

  public updateProps(properties: any): this {
    return this;
  }

  public move(
    coordinate: Coordinate,
    delay?: number | undefined,
    duration?: number | undefined,
  ): Promise<any> {
    throw new Error('Circle: move() not implemented!');
  }
}
