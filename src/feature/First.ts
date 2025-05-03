import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from '../types/FeatureName';

export class First extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.FIRST;
  }
}
