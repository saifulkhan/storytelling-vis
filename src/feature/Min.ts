import { NumericalFeature } from './NumericalFeature';
import { NumericalFeatureName } from '../types';

export class Min extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatureName.MIN;
  }
}
