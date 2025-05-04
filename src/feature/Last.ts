import { NumericalFeature } from './NumericalFeature';
import { NumericalFeatureName } from '../types';

export class Last extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatureName.LAST;
  }
}
