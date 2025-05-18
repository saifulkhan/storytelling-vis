import { NumericalFeature } from './NumericalFeature';
import { NumericalFeatureName } from '../types';

export class First extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatureName.FIRST;
  }
}
