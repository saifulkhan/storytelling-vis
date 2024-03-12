import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";

export class Min extends NumericalFeature {
  protected _height: number;

  constructor(date: Date, metric = undefined, height = undefined) {
    super(date);
    this._metric = metric;
    this._height = height;
    this._type = NumericalFeatureEnum.MIN;
  }

  set height(height) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  set rank(rank: number) {
    this._rank = rank;
  }
}