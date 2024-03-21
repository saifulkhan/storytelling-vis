import { NumericalFeature } from "./NumericalFeature";
import { FeatureType } from "./FeatureType";

export class Last extends NumericalFeature {
  constructor() {
    super();
    this.type = FeatureType.LAST;
  }
}
