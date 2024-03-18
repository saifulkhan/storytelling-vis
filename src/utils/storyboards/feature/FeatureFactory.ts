import { Peak } from "./Peak";
import { Slope } from "./Slope";
import {
  searchCurrent,
  searchGlobalMax,
  searchGlobalMin,
  searchLast,
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
      case NumericalFeatures.CURRENT:
        return searchCurrent(this.data, rank, this.props.metric);

      case NumericalFeatures.LAST:
        return searchLast(this.data, rank, this.props.metric);

      case NumericalFeatures.PEAK:
        return searchPeaks(
          this.data,
          rank,
          this.props.metric,
          this.props.window
        );

      case NumericalFeatures.MAX:
        return searchGlobalMax(this.data, rank, this.props.metric);

      case NumericalFeatures.MIN:
        return searchGlobalMin(this.data, rank, this.props.metric);

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

      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
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
