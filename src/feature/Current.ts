import { NumericalFeature } from './NumericalFeature';
import { NumericalFeatureName } from '../types/NumericalFeatureName';

export class Current extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatureName.CURRENT;
  }
}
