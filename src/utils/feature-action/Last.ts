import { NumericalFeature } from './NumericalFeature';
import { MSBFeatureName } from './MSBFeatureName';

export class Last extends NumericalFeature {
  constructor() {
    super();
    this.type = MSBFeatureName.LAST;
  }
}
