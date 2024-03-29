import { NumericalFeature } from "./NumericalFeature";
import { FeatureType } from "./FeatureType";

export class Rise extends NumericalFeature {
  grad: number;
  normGrad: number;

  constructor() {
    super();
    this.type = FeatureType.RAISE;
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
