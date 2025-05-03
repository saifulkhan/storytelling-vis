import {
  Action,
  ActionFactory,
  FeatureActionTableRow,
  ActionTableRow,
  FeatureActionTableData,
} from '../components';

import {
  TimeSeriesData,
  TimeSeriesPoint,
  TimelineActions,
  Segment,
} from '../types';
import { Feature } from './Feature';
import { FeatureFactory } from './FeatureFactory';
import { getTimeSeriesPointByDate } from '../common';
import { gmm } from './gaussian';
import {
  defaultFeatureSearchProps,
  FeatureSearchProps,
} from './FeatureSearchProps';
import { CategoricalFeature } from './CategoricalFeature';
import { segmentByImportantPeaks, segmentByPeaks } from './segmentation';

export class FeatureActionFactory {
  private data: TimeSeriesData = [];
  private numericalFeatures: FeatureActionTableRow[] = [];
  private numSegment: number = 3;
  private props: FeatureSearchProps = defaultFeatureSearchProps;
  private categoricalFeatures: CategoricalFeature[] = [];
  private dataActionArray: TimelineActions = [];
  private actionFactory = new ActionFactory();
  private featureFactory = new FeatureFactory();
  private segments: Segment[] = [];

  constructor() {}

  public setProps(props: FeatureSearchProps) {
    this.props = { ...defaultFeatureSearchProps, ...props };
    return this;
  }

  public setNumericalFeatures(table: FeatureActionTableData) {
    this.numericalFeatures = table;
    return this;
  }

  public setCategoricalFeatures(table: any) {
    this.categoricalFeatures = table.map((d: any) =>
      new CategoricalFeature()
        .setDate(new Date(d.date))
        .setRank(d.rank)
        .setDescription(d.event),
    );
    return this;
  }

  public setData(data: TimeSeriesData) {
    this.data = data;
    return this;
  }

  public segment(numSegment: number) {
    this.numSegment = numSegment;

    if (!this.data && !this.categoricalFeatures) {
      console.error('No data or categorical features provided');
      return this;
    }

    const combined = gmm(this.data, this.categoricalFeatures);
    this.segments = segmentByImportantPeaks(combined, this.numSegment);
    console.log('FeatureActionFactory: segments:', this.segments);

    return this;
  }

  /**
   * Create timeline actions
   * 1. Iterate over the numerical features in the table.
   * 2. For each feature, search the data using FeatureFactory.
   * 3. For each feature found, create all actions using createActions method.
   * 4. Group all actions belonging to the found feature.
   */
  public create() {
    this.featureFactory.setProps(this.props).setData(this.data);

    console.log('FeatureActionFactory: create: data: ', this.data);

    // 1.
    this.numericalFeatures.forEach((row: FeatureActionTableRow) => {
      console.debug('FeatureActionFactory: create: row = ', row);
      // 2.
      const features: Feature[] =
        this.featureFactory.search(row.feature, row.properties, row.rank) || [];

      console.debug('FeatureActionFactory:create: row.feature:', row.feature);
      console.debug('FeatureActionFactory:create: features = ', features);

      // 3.
      features.forEach((feature: Feature) => {
        const date: Date = feature.getDate();
        const point: TimeSeriesPoint | undefined = getTimeSeriesPointByDate(
          date,
          this.data,
        );

        if (!point) {
          // prettier-ignore
          console.error('FeatureActionFactory:create: point not found for date: ', date);
          return;
        }

        // 3.
        const actions: Action[] = this.createActions(
          row.actions,
          feature,
          point,
        );

        // 4.
        const action: Action = this.actionFactory
          .group(actions)
          ?.setFeatureType(feature?.getType());

        this.dataActionArray.push([date, action]);

        console.log('FeatureActionFactory:create: action = ', action);
      });
    });

    return this.dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }

  private createActions(
    row: ActionTableRow[],
    feature: Feature,
    point: TimeSeriesPoint,
  ) {
    let actions: Action[] = [];
    row.forEach((rowIn: ActionTableRow) => {
      const action = this.actionFactory
        .create(rowIn.action, rowIn.properties, point)
        ?.setFeatureType(feature?.getType());
      if (action) {
        actions.push(action);
      }
    });

    return actions;
  }
}
