import { Feature } from './Feature';
import { NumericalFeatureName } from '../types';

export class NumericalFeature extends Feature {
  protected height: number = 0;
  protected type: NumericalFeatureName;

  constructor() {
    super();
    this.type = NumericalFeatureName.UNKNOWN;
  }

  setType(type: NumericalFeatureName): this {
    this.type = type;
    return this;
  }

  getType(): NumericalFeatureName {
    return this.type;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  getHeight(): number {
    return this.height;
  }
}
