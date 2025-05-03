import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from '../types/FeatureName';

export class Current extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.CURRENT;
  }
}
