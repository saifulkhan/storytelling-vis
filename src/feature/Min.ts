import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from '../types';

export class Min extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.MIN;
  }
}
