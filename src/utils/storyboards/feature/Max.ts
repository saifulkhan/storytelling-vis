import { NumericalFeature } from "./NumericalFeature";
import { FeatureType } from "./FeatureType";

export class Max extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureType.MAX;
  }
}
