import { Peak } from "./Peak";
import { Slope } from "./Slope";
import { searchMinMax, searchPeaks, searchSlopes } from "./feature-search";
import { NumericalFeatures } from "./NumericalFeatures";
import {
  MLTimeseriesData,
  TimeseriesData,
} from "../data-processing/TimeseriesData";
import { Feature } from "./Feature";
import { createPredicate } from "../data-processing/common";
import { Min } from "./Min";
import { Max } from "./Max";
import { Condition } from "./Condition";
import { Current } from "./Current";
import { Last } from "./Last";

const METRIC = "Cases/day",
  WINDOW = 20;

export class FeatureFactory {
  private _data: TimeseriesData[] | MLTimeseriesData[] = [];
  private _properties: any;
  private _name = "";

  constructor() {}

  public properties(properties: any) {
    this._properties = properties;
    return this;
  }

  public data(data: TimeseriesData[] | MLTimeseriesData[]) {
    this._data = data;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  public detect(
    feature: NumericalFeatures,
    condition: Condition | string
  ): Feature[] | undefined {
    // prettier-ignore
    console.log("FeatureFactory:detect: _properties =", this._properties);
    // prettier-ignore
    console.log("FeatureFactory:detect: data =", this._data);

    switch (feature) {
      case NumericalFeatures.SLOPE:
        return this.detectSlopes(condition);
      case NumericalFeatures.PEAK:
        return this.detectPeaks(condition);
      case NumericalFeatures.MAX:
        return this.detectMax();
      case NumericalFeatures.ML_MAX:
        return this.detectMLMax(condition);
      case NumericalFeatures.ML_MIN:
        return this.detectMLMin(condition);
      case NumericalFeatures.ML_CURRENT:
        return this.detectMLCurrent();
      case NumericalFeatures.ML_LAST:
        return this.detectMLLast(this._name);
      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
  }

  detectMLLast(): Last[] {
    if (this._name) {
      // prettier-ignore
      console.error(`FeatureFactory:detectLast: the value of name = ${this._name}`);
    }
    let last = this._data[this._data.length - 1];
    return [new Last(last.date, "", last[this._name])];
  }

  detectMLCurrent(): Current[] {
    if (this._name) {
      // prettier-ignore
      console.error(`FeatureFactory:detectCurrent: the value of name = ${this._name}`);
    }
    return this._data.map((d) => new Current(d.date, "", d[this._name]));
  }

  private detectPeaks(condition: Condition): Peak[] {
    // prettier-ignore
    console.log("FeatureFactory:detectPeaks: timeseriesProcessingProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureFactory:detectPeaks: data =", this._data);
    const peaks = searchPeaks(this._data, METRIC, WINDOW);
    return peaks;
  }

  private detectMax(): Max[] {
    const [globalMin, globalMax] = searchMinMax(this._data, "y");
    console.log("FeatureFactory:detectMax: globalMax =", globalMax);
    return [globalMax];
  }

  private detectSlopes(condition: Condition): Slope[] {
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

  private detectMLMin(key: string): Min[] {
    const [globalMin, globalMax] = searchMinMax(this._data, key);
    return [globalMin];
  }

  private detectMLMax(key: string): Max[] {
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
