import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Last extends NumericalFeature {
  constructor() {
    super();
    this.type = NumericalFeatures.LAST;
  }
}
