import { NumericalFeature } from "./NumericalFeature";
import { FeatureType } from "./FeatureType";

export class Min extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureType.MIN;
  }
}
