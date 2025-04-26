import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from './FeatureName';

export class Min extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.MIN;
  }
}
