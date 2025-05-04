import {
  TimeSeriesData,
  TimeSeriesPoint,
  TimelineAction,
  Segment,
  CategoricalFeatureName,
} from '../types';
import {
  Feature,
  gmm,
  NumericalFeature,
  defaultFeatureSearchProps,
  FeatureSearchProps,
  CategoricalFeature,
  segmentByImportantPeaks,
  segmentByPeaks,
  findCategoricalFeatureByDate,
  findClosestFeature,
  findNumericalFeatureByDate,
} from '../feature';
import {
  Action,
  FeatureActionTableRow,
  ActionTableRow,
  FeatureActionTableData,
  ActionName,
  PauseProps,
} from '../components';
import { getTimeSeriesPointByDate } from '../common';
import { FeatureFactory } from './FeatureFactory';
import { ActionFactory } from './ActionFactory';

export class FeatureActionFactory {
  private data: TimeSeriesData = [];
  private props: FeatureSearchProps = defaultFeatureSearchProps;
  private numericalFATable: FeatureActionTableData = [];
  private numSegment: number = 3;

  private numericalFeatures: NumericalFeature[] = [];
  private categoricalFeatures: CategoricalFeature[] = [];
  private timelineActions: TimelineAction[] = [];
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
    this.categoricalFeatures = table.map((d: any) => {
      return new CategoricalFeature()
        .setDate(new Date(d.date))
        .setRank(d.rank)
        .setDescription(d.description)
        .setType(CategoricalFeatureName.UNKNOWN);
    });

    // prettier-ignore
    console.debug('FeatureActionFactory: categoricalFeatures: ', this.categoricalFeatures);
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
   */
  public create() {
    this.featureFactory.setProps(this.props).setData(this.data);
    this.actionsForNumericalFeatures();
    this.actionsForSegments();

    return this.timelineActions;
  }

  /**
   * 1. Iterate over the numerical features in the table.
   * 2. For each feature, search the data using FeatureFactory.
   * 3. For each feature found, create all actions using createActions method.
   * 4. Group all actions belonging to the found feature.
   */
  private actionsForNumericalFeatures() {
    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForNumericalFeatures: data: ', this.data);

    // 1.
    this.numericalFATable.forEach((row: FeatureActionTableRow) => {
      // prettier-ignore
      console.debug('FeatureActionFactory:actionsForNumericalFeatures: row = ', row);
      // 2.
      const numericalFeatures: NumericalFeature[] =
        this.featureFactory.searchNumericalFeature(
          row.feature,
          row.properties,
          row.rank,
        ) || [];

      this.numericalFeatures.push(...numericalFeatures);

      // prettier-ignore
      console.debug('FeatureActionFactory:actionsForNumericalFeatures: row.feature:', row.feature);
      // prettier-ignore
      console.debug('FeatureActionFactory:actionsForNumericalFeatures: numericalFeatures = ', numericalFeatures);

      // 3.
      numericalFeatures.forEach((feature: NumericalFeature) => {
        const date: Date = feature.getDate();
        const point: TimeSeriesPoint | undefined = getTimeSeriesPointByDate(
          date,
          this.data,
        );

        if (!point) {
          // prettier-ignore
          console.error('FeatureActionFactory: Point not found!');
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

        this.timelineActions.push([date, action]);

        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForNumericalFeatures: action:', action);
      });
    });

    // 5.
    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForNumericalFeatures: dataActionArray = ', this.timelineActions);
    this.timelineActions.sort((a, b) => b[0].getTime() - a[0].getTime());
  }

  private actionsForCategoricalFeatures() {
    // prettier-ignore
    console.error('FeatureActionFactory:actionsForCategoricalFeatures: not implemented!');
  }

  /**
   * For each segment
   * Search the feature-action tables
   * Create action objects and group them
   */
  private actionsForSegments() {
    const features: Feature[] = [];

    this.segments.forEach((segment: Segment) => {
      const feature = findClosestFeature(
        this.categoricalFeatures,
        this.numericalFeatures,
        segment.date,
      );

      if (!feature) return;

      const existingAction = this.timelineActions.find(
        (d) => d[0].getTime() === feature.getDate().getTime(),
      ) as TimelineActions | undefined;

      if (existingAction) {
        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForSegments: action already exists');
        const pasueAction = this.createPauseAction('Numerical', 'Date');
        this.timelineActions.splice(
          this.timelineActions.indexOf(existingAction as any),
          0,
          [feature.getDate(), pasueAction],
        );
      } else {
        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForSegments: action does not exist');
        const pasueAction = this.createPauseAction('Categorical', 'Date');
        this.timelineActions.splice(
          this.timelineActions.indexOf(existingAction as any),
          0,
          [feature.getDate(), pasueAction],
        );
      }

      features.push(feature);
    });

    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForSegments: features:', features);
  }

  /**
   * For each feature create action objects and group them
   */
  private createActions(
    feature: NumericalFeature,
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

  private createPauseAction(featureType: string, title: string) {
    return this.actionFactory.create(ActionName.PAUSE, {
      message: featureType,
      title: title,
    } as PauseProps);
  }
}
