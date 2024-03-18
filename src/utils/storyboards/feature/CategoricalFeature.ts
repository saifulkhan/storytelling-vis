import { CategoricalFeatures } from "./CategoricalFeatures";
import { Feature } from "./Feature";

export class CategoricalFeature extends Feature {
  protected description: string;

  constructor() {
    super();
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  getDescription() {
    return this.description;
  }
}
