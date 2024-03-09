import { Peak } from "./Peak";
import { Slope } from "./Slope";
import { searchMinMax, searchPeaks, searchSlopes } from "./feature-search";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";
import { TimeseriesDataType } from "../data-processing/TimeseriesDataType";
import { AbstractFeature } from "./AbstractFeature";
import { MLTimeseriesDataType } from "../data-processing/MLTimeseriesDataType";
import { createPredicate } from "../../common";
import { Min } from "./Min";
import { Max } from "./Max";
import { ConditionType } from "./ConditionType";
import { Current } from "./Current";
import { Last } from "./Last";

const METRIC = "Cases/day",
  WINDOW = 20;

export class FeatureFactory {
  private _data: TimeseriesDataType[] | MLTimeseriesDataType[] = [];
  private _properties: any;
  private _name = "";

  constructor() {}

  public properties(properties: any) {
    this._properties = properties;
    return this;
  }

  public data(data: TimeseriesDataType[] | MLTimeseriesDataType[]) {
    this._data = data;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  public detect(
    feature: NumericalFeatureEnum,
    condition: ConditionType | string
  ): AbstractFeature[] | undefined {
    // prettier-ignore
    console.log("FeatureFactory:detect: _properties =", this._properties);
    // prettier-ignore
    console.log("FeatureFactory:detect: data =", this._data);

    switch (feature) {
      case NumericalFeatureEnum.SLOPE:
        return this.detectSlopes(condition);
      case NumericalFeatureEnum.PEAK:
        return this.detectPeaks(condition);
      case NumericalFeatureEnum.ML_MAX:
        return this.detectMax(condition);
      case NumericalFeatureEnum.ML_MIN:
        return this.detectMin(condition);
      case NumericalFeatureEnum.CURRENT:
        return this.detectCurrent();
      case NumericalFeatureEnum.LAST:
        return this.detectLast(this._name);
      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
  }

  detectLast(): Last[] {
    if (this._name) {
      // prettier-ignore
      console.error(`FeatureFactory:detectLast: the value of name = ${this._name}`);
    }
    let last = this._data[this._data.length - 1];
    return [new Last(last.date, "", last[this._name])];
  }

  detectCurrent(): Current[] {
    if (this._name) {
      // prettier-ignore
      console.error(`FeatureFactory:detectCurrent: the value of name = ${this._name}`);
    }
    return this._data.map((d) => new Current(d.date, "", d[this._name]));
  }

  private detectPeaks(condition: ConditionType): Peak[] {
    // prettier-ignore
    console.log("FeatureFactory:detectPeaks: timeseriesProcessingProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureFactory:detectPeaks: data =", this._data);
    const peaks = searchPeaks(this._data, METRIC, WINDOW);
    return peaks;
  }

  private detectSlopes(condition: ConditionType): Slope[] {
    let slopes = searchSlopes(this._data, WINDOW);
    // console.log("detectSlopes: slopes = ", slopes);
    // console.log("detectSlopes: properties = ", properties);

    for (const [key, value] of Object.entries(condition)) {
      slopes = slopes.filter(this.predicate(key, value, "slope"));
      // prettier-ignore
      // console.log(`detectSlopes: key = ${key}, value = ${value}, slopes = `, slopes);
    }
    return slopes;
  }

  private detectMin(key: string): Min[] {
    const [globalMin, globalMax] = searchMinMax(this._data, key);
    return [globalMin];
  }

  private detectMax(key: string): Max[] {
    const [globalMin, globalMax] = searchMinMax(this._data, key);
    return [globalMax];
  }

  private predicate(
    key: string,
    value: number | string,
    attr: string
  ): (...args: unknown[]) => unknown {
    switch (key) {
      case "eq":
        return createPredicate(`obj.${attr} == ${value}`);
      case "le":
        return createPredicate(`obj.${attr} <= ${value}`);
      case "ge":
        return createPredicate(`obj.${attr}>= ${value}`);
      case "lt":
        return createPredicate(`obj.${attr} < ${value}`);
      case "gt":
        return createPredicate(`obj.${attr} > ${value}`);
      case "ne":
        return createPredicate(`obj.${attr} != ${value}`);
      default:
        // prettier-ignore
        console.error(`FeatureFactory:predicate: condition = ${key} not implemented!`)
    }
  }
}
