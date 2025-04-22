import { NumericalFeature } from './NumericalFeature';
import { MSBFeatureName } from './MSBFeatureName';

export class First extends NumericalFeature {
  constructor() {
    super();
    this.type = MSBFeatureName.FIRST;
  }
}
