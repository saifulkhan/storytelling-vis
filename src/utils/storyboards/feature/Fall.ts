import { number } from "yup";
import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Fall extends NumericalFeature {
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
    this.type = NumericalFeatures.FALL;
  }

  setGrad(grad: number) {
    this.grad = grad;
    return this;
  }

  getGrad() {
    if (!this.grad) {
      throw "You must set Fall grad using setGrad().";
    }
    // TODO: check
    return this.grad > 5 ? "steep" : this.grad > 2 ? "steady" : "slow";
  }

  setNormGrad(normGrad: number) {
    this.normGrad = normGrad;
    return this;
  }

  getNormGrad() {
    return this.normGrad;
  }
}
