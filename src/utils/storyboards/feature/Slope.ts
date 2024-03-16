import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Slope extends NumericalFeature {
  height: number;
  grad: number;
  normGrad: number;

  constructor(
    date: Date,
    height: number,
    rank?: number,
    metric?: string,
    start?: Date,
    end?: Date
  ) {
    super(date, height, rank, metric, start, end);
    this.type = NumericalFeatures.SLOPE;
  }

  setGrad(grad: number) {
    this.grad = grad;
    return this;
  }

  setNormGrad(normGrad: number) {
    this.normGrad = normGrad;
    return this;
  }

  getGrad() {
    // TODO: check
    return this.grad > 5 ? "steep" : this.grad > 2 ? "steady" : "slow";
  }

  getNormGrad(normGrad: number) {
    return this.normGrad;
  }
}
