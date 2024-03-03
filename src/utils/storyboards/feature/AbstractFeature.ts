import { CategoricalFeatureEnum } from "./CategoricalFeatureEnum";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";

export type FeaturesType = AbstractFeature[];

export abstract class AbstractFeature {
  protected _date: Date;
  protected _start: Date;
  protected _end: Date;
  protected _rank: number;
  protected _type: CategoricalFeatureEnum | NumericalFeatureEnum;

  constructor(date, start = undefined, end = undefined) {
    this._date = date;
    this._start = start;
    this._end = end;
  }

  set date(date: Date) {
    this._date = date;
  }

  get date() {
    return this._date;
  }

  set start(start: Date) {
    this._start = start;
  }

  get start() {
    return this._start;
  }

  set end(end: Date) {
    this._end = end;
  }

  get end() {
    return this._end;
  }

  set rank(rank) {
    this._rank = rank;
  }

  get rank() {
    return this._rank;
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  get duration() {
    if (!this._start || !this._end)
      throw "This object doesn't have an end or start.";
    const difference = this._end.getTime() - this._start.getTime();
    const dayInMs = 1000 * 3600 * 24;
    return Math.floor(difference / dayInMs);
  }
}
