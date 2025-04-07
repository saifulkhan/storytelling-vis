import {
  searchCurrent,
  searchFirst,
  searchGlobalMax,
  searchGlobalMin,
  searchLast,
  searchPeaks,
  searchSlopes,
} from "./feature-search";
import { MSBFeatureName } from "./MSBFeatureName";
import { TimeSeriesPoint } from "../../types/TimeSeriesPoint";
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from "./FeatureSearchProps";

import { MSBFeature } from "./MSBFeature";
import { createPredicate } from "../common";
import { Condition } from "./Condition";

export class MSBFeatureFactory {
  private data: TimeSeriesPoint[];
  private props: FeatureSearchProps;

  constructor() {}

  public setProps(props: FeatureSearchProps) {
    this.props = { ...defaultFeatureSearchProps, ...props };
    return this;
  }

  public setData(data: TimeSeriesPoint[]) {
    this.data = data;
    return this;
  }

  /**
   ** Search for feature and returns list of feature objects.
   **/
  public search(
    feature: MSBFeatureName,
    condition: Condition | string,
    rank: number
  ): MSBFeature[] | undefined {
    console.log("MSBFeatureFactory:search: props =", this.props);
    console.log("MSBFeatureFactory:search: data =", this.data);
    // prettier-ignore
    console.log("MSBFeatureFactory:search: feature: ", feature, ", condition: ", condition, ", rank:", rank);

    switch (feature) {
      case MSBFeatureName.FIRST:
        return searchFirst(this.data, rank, this.props.metric);

      case MSBFeatureName.CURRENT:
        return searchCurrent(this.data, rank, this.props.metric);

      case MSBFeatureName.LAST:
        return searchLast(this.data, rank, this.props.metric);

      case MSBFeatureName.PEAK:
        return searchPeaks(
          this.data,
          rank,
          this.props.metric,
          this.props.window
        );

      case MSBFeatureName.MAX:
        return searchGlobalMax(this.data, rank, this.props.metric);

      case MSBFeatureName.MIN:
        return searchGlobalMin(this.data, rank, this.props.metric);

      case MSBFeatureName.SLOPE:
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
      case "lte":
        return createPredicate(`obj.${attr} <= ${value}`);
      case "gte":
        return createPredicate(`obj.${attr}>= ${value}`);
      case "lt":
        return createPredicate(`obj.${attr} < ${value}`);
      case "gt":
        return createPredicate(`obj.${attr} > ${value}`);
      case "ne":
        return createPredicate(`obj.${attr} != ${value}`);
      default:
        // prettier-ignore
        console.error(`MSBFeatureFactory:predicate: condition = ${key} not implemented!`)
    }
  }
}
