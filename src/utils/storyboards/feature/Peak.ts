import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";

// TODO: Why?
const CONST = 0.2;

export type PeakProperties = unknown;

export class Peak extends NumericalFeature {
  protected _height: number;
  protected _normHeight: number;
  protected _normWidth: number;
  protected _normDuration: number;

  constructor(
    date,
    start = undefined,
    end = undefined,
    metric = undefined,
    height = undefined,
    normWidth = undefined,
    normHeight = undefined,
  ) {
    super(date, start, end, metric);
    this._type = NumericalFeatureEnum.PEAK;
    this._height = height;
    this._normWidth = normWidth;
    this._normHeight = normHeight;
  }

  set height(height) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  set normHeight(normHeight) {
    this._normHeight = normHeight;
  }

  set normWidth(normWidth) {
    this._normWidth = normWidth;
  }

  set rank(rank: number) {
    this._rank = rank;
  }

  get rank() {
    if (this._rank) return this._rank;

    if (!this._normHeight) throw "Set normHeight";
    return 1 + Math.floor(this._normHeight / CONST);
  }
}
