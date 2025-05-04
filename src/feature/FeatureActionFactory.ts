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
import {
  findCategoricalFeatureByDate,
  findNumericalFeatureByDate,
} from './feature-search';
import { NumericalFeature } from './NumericalFeature';

export class FeatureActionFactory {
  private data: TimeSeriesData = [];
  private props: FeatureSearchProps = defaultFeatureSearchProps;
  private numericalFATable: FeatureActionTableData = [];
  private numSegment: number = 3;

  private numericalFeatures: NumericalFeature[] = [];
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
    this.numericalFATable = table;
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

  public segment(numSegment: number, method: 'gmm' | 'peaks') {
    this.numSegment = numSegment;

    if (!this.data || this.data.length === 0) {
      console.error('No data provided');
      return this;
    }

    if (method === 'gmm' && !this.categoricalFeatures) {
      console.error('No categorical features provided');
      return this;
    }

    // currently segment by gmm or peaks are only supported
    if (method === 'gmm') {
      const combined = gmm(this.data, this.categoricalFeatures);
      this.segments = segmentByPeaks(combined, this.numSegment);
    } else {
      this.segments = segmentByPeaks(this.data, this.numSegment);
    }

    // prettier-ignore
    console.debug('FeatureActionFactory:segment: segments:', this.segments);
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
    this.createActionsForNumericalFeatures();
    this.createActionsForSegments();

    return this.dataActionArray;
  }

  private createActionsForNumericalFeatures() {
    // prettier-ignore
    console.debug('FeatureActionFactory:createActionsForNumericalFeatures: data: ', this.data);

    // 1.
    this.numericalFATable.forEach((row: FeatureActionTableRow) => {
      // prettier-ignore
      console.debug('FeatureActionFactory:createActionsForNumericalFeatures: row = ', row);
      // 2.
      const numericalFeatures: NumericalFeature[] =
        this.featureFactory.searchNumericalFeature(
          row.feature,
          row.properties,
          row.rank,
        ) || [];

      this.numericalFeatures.push(...numericalFeatures);

      // prettier-ignore
      console.debug('FeatureActionFactory:createActionsForNumericalFeatures: row.feature:', row.feature);
      // prettier-ignore
      console.debug('FeatureActionFactory:createActionsForNumericalFeatures: numericalFeatures = ', numericalFeatures);

      // 3.
      numericalFeatures.forEach((feature: NumericalFeature) => {
        const date: Date = feature.getDate();
        const point: TimeSeriesPoint | undefined = getTimeSeriesPointByDate(
          date,
          this.data,
        );

        if (!point) {
          // prettier-ignore
          console.error('FeatureActionFactory:createActionsForNumericalFeatures: point not found for date: ', date);
          return;
        }

        // 3.
        const actions: Action[] = this.createActions(
          feature,
          row.actions,
          point,
        );

        // 4.
        const action: Action = this.actionFactory
          .group(actions)
          ?.setFeatureType(feature?.getType());

        this.dataActionArray.push([date, action]);

        // prettier-ignore
        console.debug('FeatureActionFactory:createActionsForNumericalFeatures: action:', action);
      });
    });

    // 5.
    // prettier-ignore
    console.debug('FeatureActionFactory:createActionsForNumericalFeatures: dataActionArray = ', this.dataActionArray);
    this.dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }

  private createActionsForCategoricalFeatures() {
    // prettier-ignore
    console.error('FeatureActionFactory:createActionsForCategoricalFeatures: not implemented!');
  }

  /**
   * For each segment
   * Search the feature-action tables
   * Create action objects and group them
   */
  private createActionsForSegments() {
    this.segments.forEach((segment: Segment) => {
      const feature1 = findCategoricalFeatureByDate(
        this.categoricalFeatures,
        segment.date,
      );
      const feature2 = findNumericalFeatureByDate(
        this.numericalFeatures,
        segment.date,
      );
      // prettier-ignore
      console.debug('FeatureActionFactory:createActionsForSegments: feature1:', feature1);
      // prettier-ignore
      console.debug('FeatureActionFactory:createActionsForSegments: feature2:', feature2);

      // const action: Action = this.actionFactory
      //   .create('segment', {}, segment)
      //   ?.setFeatureType('segment');
      // this.dataActionArray.push([segment.getDate(), action]);
    });
  }

  /**
   * For each feature create action objects and group them
   */
  private createActions(
    feature: Feature,
    actionRows: ActionTableRow[],
    point: TimeSeriesPoint,
  ) {
    let actions: Action[] = [];
    actionRows.forEach((d: ActionTableRow) => {
      const action = this.actionFactory
        .create(d.action, d.properties, point)
        ?.setFeatureType(feature?.getType());
      if (action) {
        actions.push(action);
      }
    });

    return actions;
  }
}
