import { Feature } from './Feature';
import { CategoricalFeatureName } from '../types';

export class CategoricalFeature extends Feature {
  protected description: string = '';
  protected type: CategoricalFeatureName;

  constructor() {
    super();
    this.type = CategoricalFeatureName.UNKNOWN;
  }

  setType(type: CategoricalFeatureName): this {
    this.type = type;
    return this;
  }

  getType(): CategoricalFeatureName {
    return this.type;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  getDescription() {
    return this.description;
  }
}
