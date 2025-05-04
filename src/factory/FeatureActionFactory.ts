import {
  TimeSeriesData,
  TimeSeriesPoint,
  TimelineAction,
  Segment,
  CategoricalFeatureName,
  NumericalFeatureName,
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
  private categoricalEventsData: any[] = [];
  private props: FeatureSearchProps = defaultFeatureSearchProps;
  private numericalFATable: FeatureActionTableData = [];
  private categoricalFATable: FeatureActionTableData = [];
  private numSegment: number = 3;

  private numericalFeatures: NumericalFeature[] = [];
  private categoricalFeatures: CategoricalFeature[] = [];

  private actionFactory: ActionFactory = new ActionFactory();
  private featureFactory: FeatureFactory = new FeatureFactory();
  private timelineActions: TimelineAction[] = [];
  private tempTimelineActions: TimelineAction[] = []; // for categorical features, we need to remove  this
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

  public setCategoricalFeatures(
    categoricalEventsData: any,
    categoricalFATable: FeatureActionTableData,
  ) {
    this.categoricalEventsData = categoricalEventsData;
    this.categoricalFATable = categoricalFATable;

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
    this.actionsForCategoricalFeatures();
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
          row.feature as NumericalFeatureName,
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
    // For each categorical event, create a feature and its actions
    this.categoricalEventsData.forEach((d: any) => {
      const feature = new CategoricalFeature()
        .setDate(new Date(d.date))
        .setRank(d.rank)
        .setDescription(d.description);

      this.categoricalFeatures.push(feature);

      const date: Date = feature.getDate();
      const point: TimeSeriesPoint | undefined = getTimeSeriesPointByDate(
        date,
        this.data,
      );

      if (!point) {
        // prettier-ignore
        console.error('FeatureActionFactory: Point not found for categorical event!', d);
        return;
      }

      // create came actions for this categorical feature
      const actions: Action[] = this.createActions(
        feature,
        this.categoricalFATable[0].actions,
        point,
      );

      // group actions and set feature type
      const action: Action = this.actionFactory
        .group(actions)
        ?.setFeatureType(feature?.getType());

      this.tempTimelineActions.push([date, action]);

      // prettier-ignore
      // console.debug('FeatureActionFactory:actionsForCategoricalFeatures: action:', action);
    });

    // prettier-ignore
    // console.debug('FeatureActionFactory:actionsForCategoricalFeatures: categoricalFeatures = ', this.categoricalFeatures);
  }

  /**
   * For each segment
   * Search the feature-action tables
   * Create action objects and group them
   */
  private actionsForSegments() {
    const features: Feature[] = [];

    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForSegments: categoricalFeatures:', this.categoricalFeatures);
    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForSegments: segments:', this.segments);

    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForSegments: tempTimelineActions:', this.tempTimelineActions);
    this.segments.forEach((segment: Segment) => {
      const feature = findClosestFeature(
        this.categoricalFeatures,
        this.numericalFeatures,
        segment.date,
      );

      if (!feature) return;
      // prettier-ignore
      console.debug('FeatureActionFactory:actionsForSegments: feature:', feature);

      // check if action already exists in timelineActions
      let index = this.timelineActions.findIndex(
        (d) => d[0].getTime() === feature.getDate().getTime(),
      );

      if (index >= 0) {
        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForSegments: found action in timelineActions');
        this.timelineActions[index][1].updateProps({ pause: true } as any);
        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForSegments: timelineAction:', this.timelineActions[index][1]);
      }

      // check if action already exists in tempTimelineActions
      let index2 = this.tempTimelineActions.findIndex(
        (d) => d[0].getTime() === feature.getDate().getTime(),
      );

      if (index2 >= 0) {
        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForSegments: found action in tempTimelineActions');
        this.tempTimelineActions[index2][1].updateProps({ pause: true } as any);
        this.timelineActions.push(this.tempTimelineActions[index2]);
        // prettier-ignore
        console.debug('FeatureActionFactory:actionsForSegments: timelineAction:', this.timelineActions[this.timelineActions.length - 1][1]);
      }

      features.push(feature);
    });

    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForSegments: features:', features);
    // prettier-ignore
    console.debug('FeatureActionFactory:actionsForSegments: timelineActions:', this.timelineActions);
  }

  /**
   * For each feature create action objects and group them
   */
  private createActions(
    feature: NumericalFeature | CategoricalFeature,
    actionRows: ActionTableRow[],
    point: TimeSeriesPoint,
  ) {
    let actions: Action[] = [];
    actionRows.forEach((d: ActionTableRow) => {
      const action = this.actionFactory
        .create(d.action, { ...d.properties, templateVariables: point } as any)
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
