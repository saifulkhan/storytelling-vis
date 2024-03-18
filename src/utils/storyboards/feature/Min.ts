import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Min extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatures.MIN;
  }
}
