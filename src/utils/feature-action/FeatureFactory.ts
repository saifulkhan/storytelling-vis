import {
  searchCurrent,
  searchFirst,
  searchGlobalMax,
  searchGlobalMin,
  searchLast,
  searchPeaks,
  searchSlopes,
} from './feature-search';
import { FeatureName } from './FeatureName';
import { TimeSeriesData } from 'src/types/TimeSeriesPoint';
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from './FeatureSearchProps';

import { Feature } from './Feature';
import { createPredicate } from '../common';
import { Condition } from './Condition';

export class FeatureFactory {
  private data: TimeSeriesData;
  private props: FeatureSearchProps;

  constructor() {
    this.data = [];
    this.props = defaultFeatureSearchProps;
  }

  public setProps(props: FeatureSearchProps) {
    this.props = { ...defaultFeatureSearchProps, ...props };
    return this;
  }

  public setData(data: TimeSeriesData) {
    this.data = data;
    return this;
  }

  /**
   ** Search for feature and returns list of feature objects.
   **/
  public search(
    feature: FeatureName,
    condition: Condition | string,
    rank: number,
  ): Feature[] | undefined {
    console.log('FeatureFactory:search: props =', this.props);
    console.log('FeatureFactory:search: data =', this.data);
    // prettier-ignore
    console.log("FeatureFactory:search: feature: ", feature, ", condition: ", condition, ", rank:", rank);

    switch (feature) {
      case FeatureName.FIRST:
        return searchFirst(this.data, rank, this.props.metric || '');

      case FeatureName.CURRENT:
        return searchCurrent(this.data, rank, this.props.metric || '');

      case FeatureName.LAST:
        return searchLast(this.data, rank, this.props.metric || '');

      case FeatureName.PEAK:
        return searchPeaks(
          this.data,
          rank,
          this.props.metric || '',
          this.props.window || 10,
        );

      case FeatureName.MAX:
        return searchGlobalMax(this.data, rank, this.props.metric || '');

      case FeatureName.MIN:
        return searchGlobalMin(this.data, rank, this.props.metric || '');

      case FeatureName.SLOPE:
        let slopes = searchSlopes(
          this.data,
          rank,
          this.props.metric || '',
          this.props.window || 10,
        );
        for (const [key, value] of Object.entries(condition)) {
          slopes = slopes.filter(this.predicate(key, value, 'slope'));
        }
        return slopes;

      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
  }

  private predicate(
    key: string,
    value: number | string,
    attr: string,
  ): (...args: unknown[]) => unknown {
    switch (key) {
      case 'eq':
        return createPredicate(`obj.${attr} == ${value}`) || (() => false);
      case 'lte':
        return createPredicate(`obj.${attr} <= ${value}`) || (() => false);
      case 'gte':
        return createPredicate(`obj.${attr}>= ${value}`) || (() => false);
      case 'lt':
        return createPredicate(`obj.${attr} < ${value}`) || (() => false);
      case 'gt':
        return createPredicate(`obj.${attr} > ${value}`) || (() => false);
      case 'ne':
        return createPredicate(`obj.${attr} != ${value}`) || (() => false);
      default:
        // prettier-ignore
        console.error(`FeatureFactory:predicate: condition = ${key} not implemented!`)
        // Return a default predicate that always returns false
        return () => false;
    }
  }
}
