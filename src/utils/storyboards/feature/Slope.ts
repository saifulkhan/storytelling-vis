import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";

export type SlopeProperties = {
  eq?: number;
  le?: number;
  ge?: number;
  lt?: number;
  gt?: number;
  ne?: number;
};

export class Slope extends NumericalFeature {
  protected _slope: string;

  constructor(
    date,
    start = undefined,
    end = undefined,
    metric = undefined,
    slope = undefined,
  ) {
    super(date, start, end, metric);
    this._slope = slope;
    this._type = NumericalFeatureEnum.SLOPE;
  }

  set metric(metric) {
    this._metric = metric;
  }

  get metric() {
    return this._metric;
  }

  set slope(metric) {
    this._slope = metric;
  }

  get slope() {
    return this._slope;
  }
}
