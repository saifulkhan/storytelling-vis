import { Peak } from "./Peak";
import { Slope } from "./Slope";
import {
  searchGlobalMax,
  searchMinMax,
  searchPeaks,
  searchSlopes,
} from "./feature-search";
import { NumericalFeatures } from "./NumericalFeatures";
import { TimeseriesData } from "../data-processing/TimeseriesData";
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from "../feature/FeatureSearchProps";

import { Feature } from "./Feature";
import { createPredicate } from "../data-processing/common";
import { Min } from "./Min";
import { Max } from "./Max";
import { Condition } from "./Condition";
import { Current } from "./Current";
import { Last } from "./Last";

export class FeatureFactory {
  private data: TimeseriesData[];
  private props: FeatureSearchProps;

  constructor() {}

  public setProps(props: FeatureSearchProps) {
    this.props = { ...defaultFeatureSearchProps, ...props };
    return this;
  }

  public setData(data: TimeseriesData[]) {
    this.data = data;
    return this;
  }

  /**
   ** Search for feature and returns list of feature objects.
   **/
  public search(
    feature: NumericalFeatures,
    condition: Condition | string,
    rank: number
  ): Feature[] | undefined {
    console.log("FeatureFactory:search: props =", this.props);
    console.log("FeatureFactory:search: data =", this.data);
    // prettier-ignore
    console.log("FeatureFactory:search: feature: ", feature, ", condition: ", condition, ", rank:", rank);

    switch (feature) {
      case NumericalFeatures.PEAK:
        return searchPeaks(
          this.data,
          rank,
          this.props.metric,
          this.props.window
        );

      case NumericalFeatures.MAX:
        return searchGlobalMax(this.data, rank, this.props.metric);

      case NumericalFeatures.SLOPE:
        let slopes = searchSlopes(
          this.data,
          rank,
          this.props.metric,
          this.props.window
        );
        for (const [key, value] of Object.entries(condition)) {
          slopes = slopes.filter(this.predicate(key, value, "slope"));
        }
        return slopes;
      // case NumericalFeatures.ML_MAX:
      //   return this.detectMLMax(condition);
      // case NumericalFeatures.ML_MIN:
      //   return this.detectMLMin(condition);
      // case NumericalFeatures.ML_CURRENT:
      //   return this.detectMLCurrent();
      // case NumericalFeatures.ML_LAST:
      //   return this.detectMLLast(this._name);
      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
  }

  // detectMLLast(): Last[] {
  //   if (this._name) {
  //     // prettier-ignore
  //     console.error(`FeatureFactory:detectLast: the value of name = ${this._name}`);
  //   }
  //   let last = this.data[this.data.length - 1];
  //   return [new Last(last.date, "", last[this._name])];
  // }

  // detectMLCurrent(): Current[] {
  //   if (this._name) {
  //     // prettier-ignore
  //     console.error(`FeatureFactory:detectCurrent: the value of name = ${this._name}`);
  //   }
  //   return this.data.map((d) => new Current(d.date, "", d[this._name]));
  // }

  // private detectPeaks(condition: Condition): Peak[] {
  //   // prettier-ignore
  //   console.log("FeatureFactory:detectPeaks: timeseriesProcessingProperties =", this.props);
  //   // prettier-ignore
  //   console.log("FeatureFactory:detectPeaks: data =", this.data);
  //   const peaks = searchPeaks(this.data, this.props.metric, this.props.window);
  //   return peaks;
  // }

  // private detectMax(): Max[] {
  //   const [globalMin, globalMax] = searchMinMax(this.data, "y");
  //   console.log("FeatureFactory:detectMax: globalMax =", globalMax);
  //   return [globalMax];
  // }

  // private detectSlopes(condition: Condition): Slope[] {
  //   let slopes = searchSlopes(this.data, this.props.window);
  //   // console.log("detectSlopes: slopes = ", slopes);
  //   // console.log("detectSlopes: properties = ", properties);

  //   for (const [key, value] of Object.entries(condition)) {
  //     slopes = slopes.filter(this.predicate(key, value, "slope"));
  //     // prettier-ignore
  //     // console.log(`detectSlopes: key = ${key}, value = ${value}, slopes = `, slopes);
  //   }
  //   return slopes;
  // }

  // private detectMLMin(key: string): Min[] {
  //   const [globalMin, globalMax] = searchMinMax(this.data, key);
  //   return [globalMin];
  // }

  // private detectMLMax(key: string): Max[] {
  //   const [globalMin, globalMax] = searchMinMax(this.data, key);
  //   return [globalMax];
  // }

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
