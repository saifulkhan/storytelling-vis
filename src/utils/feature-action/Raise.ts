import { NumericalFeature } from "./NumericalFeature";
import { MSBFeatureName } from "./MSBFeatureName";

export class Rise extends NumericalFeature {
  protected grad: number = 0;
  protected normGrad: number = 0;

  constructor() {
    super();
    this.type = MSBFeatureName.RAISE;
  }

  setGrad(grad: number) {
    this.grad = grad;
    return this;
  }

  getGrad() {
    // TODO: check
    return this.grad > 5 ? "steep" : this.grad > 2 ? "steady" : "slow";
  }

  setNormGrad(normGrad: number) {
    this.normGrad = normGrad;
    return this;
  }

  getNormGrad(normGrad: number) {
    return this.normGrad;
  }
}
