import { Peak } from "./Peak";
import { Slope } from "./Slope";
import { searchMinMax, searchPeaks, searchSlopes } from "./feature-search";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";
import { TimeseriesDataType } from "../feature-action-builder/TimeseriesDataType";
import { AbstractFeature } from "./AbstractFeature";
import { ML_TimeseriesDataType } from "../feature-action-builder/ML_TimeseriesDataType";
import { createPredicate } from "../feature-action-builder/common";
import { Min } from "./Min";
import { Max } from "./Max";
import { ConditionType } from "./ConditionType";
import { Current } from "./Current";
import { Last } from "./Last";

export type FeatureSearchProperties = {
  metric?: string;
  window?: number;
};

export class FeatureSearch {
  private _data: TimeseriesDataType[] | ML_TimeseriesDataType[];
  private _properties: FeatureSearchProperties;

  constructor(
    data: TimeseriesDataType[] | ML_TimeseriesDataType[],
    featureSearchProperties: FeatureSearchProperties
  ) {
    this._data = data;
    this._properties = featureSearchProperties;

    // prettier-ignore
    console.log("FeatureSearch: featureSearchProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureSearch: data =", this._data);
  }

  protected predicate(
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
    }
  }

  public detect(
    feature: NumericalFeatureEnum,
    condition: ConditionType | string
  ): AbstractFeature[] | undefined {
    // prettier-ignore
    console.log("FeatureSearch:detect: _properties =", this._properties);
    // prettier-ignore
    console.log("FeatureSearch:detect: data =", this._data);

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
        return this.detectLast();
      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
  }

  detectLast(key: string): Last[] {
    let last = this._data[this._data.length - 1];
    return [new Last(last.date, "", last[key] && last.y)];
  }
  detectCurrent(): Current[] {
    this._data.map((d) => new Current(d.date, "", d[key] || d.y));
  }

  private detectPeaks(condition: ConditionType): Peak[] {
    // prettier-ignore
    console.log("FeatureSearch:detectPeaks: timeseriesProcessingProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureSearch:detectPeaks: data =", this._data);

    const peaks = searchPeaks(
      this._data,
      this._properties.metric,
      this._properties.window
    );

    return peaks;
  }

  private detectSlopes(condition: ConditionType): Slope[] {
    let slopes = searchSlopes(this._data, this._properties.window);
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
}
