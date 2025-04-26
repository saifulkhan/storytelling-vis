import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from './FeatureName';

export class Max extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.MAX;
  }
}
