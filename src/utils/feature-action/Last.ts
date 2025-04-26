import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from './FeatureName';

export class Last extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.LAST;
  }
}
