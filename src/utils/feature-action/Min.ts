import { NumericalFeature } from "./NumericalFeature";
import { MSBFeatureName } from "./MSBFeatureName";

export class Min extends NumericalFeature {
  constructor() {
    super();
    this.type = MSBFeatureName.MIN;
  }
}
