import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Max extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatures.MAX;
  }
}
