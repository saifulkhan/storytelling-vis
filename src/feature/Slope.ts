import { NumericalFeature } from './NumericalFeature';
import { NumericalFeatureName } from '../types';

export class Slope extends NumericalFeature {
  protected slope: number = 0;

  constructor() {
    super();
    this.type = NumericalFeatureName.SLOPE;
  }

  setSlope(slope: number) {
    this.slope = slope;
    return this;
  }

  getSlope(): number {
    return this.slope;
  }
}
