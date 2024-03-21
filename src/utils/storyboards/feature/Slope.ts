import { NumericalFeature } from "./NumericalFeature";
import { FeatureType } from "./FeatureType";

export class Slope extends NumericalFeature {
  slope: number;

  constructor() {
    super();
    this.type = FeatureType.SLOPE;
  }

  setSlope(slope: number) {
    this.slope = slope;
    return this;
  }

  getSlope(): number {
    return this.slope;
  }
}
