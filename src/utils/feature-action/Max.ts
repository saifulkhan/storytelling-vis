import { NumericalFeature } from './NumericalFeature';
import { MSBFeatureName } from './MSBFeatureName';

export class Max extends NumericalFeature {
  constructor() {
    super();
    this.type = MSBFeatureName.MAX;
  }
}
