import { NumericalFeature } from "./NumericalFeature";
import { MSBFeatureName } from "./MSBFeatureName";

export class Peak extends NumericalFeature {
  protected normHeight: number;
  protected normWidth: number;
  protected normDuration: number;

  constructor() {
    super();
    this.type = MSBFeatureName.PEAK;
  }

  setNormWidth(normWidth: number) {
    this.normWidth = normWidth;
    return this;
  }

  getNormWidth() {
    return this.normWidth;
  }

  setNormHeight(normHeight: number) {
    this.normHeight = normHeight;
    return this;
  }

  getNormHeight() {
    return this.normHeight;
  }

  setNormDuration(normDuration: number) {
    this.normDuration = normDuration;
    return this;
  }
  getNormDuration() {
    return this.normDuration;
  }
}
