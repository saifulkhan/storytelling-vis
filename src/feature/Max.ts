import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from '../types';

export class Max extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.MAX;
  }
}
