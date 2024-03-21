import { NumericalFeature } from "./NumericalFeature";
import { FeatureType } from "./FeatureType";

export class Current extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureType.CURRENT;
  }
}
