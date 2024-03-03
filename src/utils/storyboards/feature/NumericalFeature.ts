import { AbstractFeature } from "./AbstractFeature";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";

export class NumericalFeature extends AbstractFeature {
  protected _metric: string;

  constructor(date, start = undefined, end = undefined, metric = undefined) {
    super(date, start, end);
    this._metric = metric;
    this._type = NumericalFeatureEnum.DEFAULT;
  }

  set metric(metric) {
    this._metric = metric;
  }

  get metric() {
    return this._metric;
  }
}
