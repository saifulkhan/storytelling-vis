import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from './FeatureName';

export class Slope extends NumericalFeature {
  protected slope: number = 0;

  constructor() {
    super();
    this.type = FeatureName.SLOPE;
  }

  setSlope(slope: number) {
    this.slope = slope;
    return this;
  }

  getSlope(): number {
    return this.slope;
  }
}
