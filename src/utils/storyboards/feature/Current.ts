import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Current extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatures.CURRENT;
  }
}
