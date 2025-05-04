import { NumericalFeature } from './NumericalFeature';
import { NumericalFeatureName } from '../types';

export class Max extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatureName.MAX;
  }
}
