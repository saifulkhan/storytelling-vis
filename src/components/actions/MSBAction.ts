import * as d3 from "d3";
import { MSBActionName } from "./MSBActionName";
import { MSBFeatureName } from "src/utils/feature-action/MSBFeatureName";
import { MSBCategoricalFeatureName } from "src/utils/feature-action/CategoricalFeature";
import { Coordinate } from "src/types/Coordinate";

const DELAY = 0,
  DURATION = 1000;

export abstract class MSBAction {
  protected type!: MSBActionName;
  protected props: any = {};
  protected svg!: SVGGElement;
  protected node: any = null;
  protected coordinate0!: Coordinate;
  protected coordinate1!: Coordinate;
  protected featureType?: MSBFeatureName | MSBCategoricalFeatureName;

  constructor() {}

  public abstract setProps(properties: unknown): this;
  public abstract updateProps(properties: any): this;

  public getType(): MSBActionName {
    return this.type;
  }

  public abstract setCanvas(svg: SVGGElement): this;

  /**
   ** Set two coordinates source, [x0, y1] and destination, [x1, y1].
   **/
  public abstract setCoordinate(coordinate: [Coordinate, Coordinate]): this;

  public show(delay = DELAY, duration = DURATION) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this.node)
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

  public hide(delay = DELAY, duration = DURATION) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this.node)
        .transition()
        .delay(0)
        .duration(duration)
        .style("opacity", 0)
        .on("end", () => {
          resolve(delay + duration);
        });
    });
  }

  /**
   ** Move object from [x1, y1] coordinate to [x2, y2] coordinate.
   **/
  public abstract move(
    coordinate: Coordinate,
    delay: number,
    duration: number
  ): Promise<any>;

  public remove() {
    d3.select(this.node).select("svg").remove();
    return this;
  }

  public abstract draw(): void;
  protected canvas(): void {
    this.node = d3
      .create("svg")
      .append("g")
      .style("opacity", 0)
      // another way to hide this object
      // .attr("display", "none")
      .node();

    d3.select(this.svg).append(() => this.node);
  }

  public setFeatureType(featureType: MSBFeatureName | MSBCategoricalFeatureName) {
    this.featureType = featureType;
    return this;
  }

  public getFeatureType() {
    return this.featureType;
  }
}
