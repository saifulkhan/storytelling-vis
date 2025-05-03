import { NumericalFeature } from './NumericalFeature';
import { FeatureName } from '../types';

export class Last extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureName.LAST;
  }
}
