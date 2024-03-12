import { Feature } from "./Feature";
import { NumericalFeatures } from "./NumericalFeatures";

export class NumericalFeature extends Feature {
  protected _metric: string;

  constructor(
    date: Date,
    start = undefined,
    end = undefined,
    metric = undefined
  ) {
    super(date, start, end);
    this._metric = metric;
    this._type = NumericalFeatures.DEFAULT;
  }

  set metric(metric) {
    this._metric = metric;
  }

  get metric() {
    return this._metric;
  }
}
