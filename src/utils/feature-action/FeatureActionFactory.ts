import { TimeSeriesData, TimeSeriesPoint } from 'src/types/TimeSeriesPoint';
import { Feature } from 'src/utils/feature-action/Feature';
import { ActionFactory } from 'src/components/actions/ActionFactory';
import {
  FeatureActionTableRow,
  ActionTableRow,
  FeatureActionTableData,
} from 'src/components/tables/FeatureActionTableRow';
import { FeatureFactory } from 'src/utils/feature-action/FeatureFactory';
import { Action } from 'src/components/actions/Action';
import { TimelineActions } from 'src/types/TimelineActions';
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from 'src/utils/feature-action/FeatureSearchProps';
import { getTimeSeriesPointByDate } from '../common';

export class FeatureActionFactory {
  private data: TimeSeriesData;
  private table: FeatureActionTableRow[];
  private props: FeatureSearchProps;

  constructor() {
    this.data = [];
    this.table = [];
    this.props = defaultFeatureSearchProps;
  }

  public setFAProps(props: FeatureSearchProps) {
    this.props = { ...defaultFeatureSearchProps, ...props };
    return this;
  }

  public setTable(table: FeatureActionTableData) {
    this.table = table;
    return this;
  }

  public setData(data: TimeSeriesData) {
    this.data = data;
    return this;
  }

  public create() {
    const dataActionArray: TimelineActions = [];
    const actionFactory = new ActionFactory();
    const featureFactory = new FeatureFactory()
      .setProps(this.props)
      .setData(this.data);

    console.log('FeatureActionFactory: create: data: ', this.data);

    this.table.forEach((row: FeatureActionTableRow) => {
      console.log('FeatureActionFactory: create: row = ', row);

      //
      // search features
      //
      const searchResult = featureFactory.search(
        row.feature,
        row.properties,
        row.rank,
      );
      const features: Feature[] = searchResult || [];
      // prettier-ignore
      console.log("FeatureActionFactory:create: feature:", row.feature, ", features = ", features);

      //
      // create actions of each features
      //
      features.forEach((feature: Feature) => {
        const date: Date = feature.getDate();
        const point: TimeSeriesPoint | undefined = getTimeSeriesPointByDate(
          date,
          this.data,
        );

        let actions: Action[] = [];
        row.actions.forEach((rowIn: ActionTableRow) => {
          //
          // create action
          //
          const action = actionFactory
            .create(rowIn.action, rowIn.properties, point)
            ?.setFeatureType(feature?.getType());
          if (action) {
            actions.push(action);
          }
          // prettier-ignore
          // console.log("FeatureActionFactory: action = ", action);
        });

        //
        // group all actions of the feature
        //
        const action: Action = actionFactory
          .group(actions)
          ?.setFeatureType(feature?.getType());

        dataActionArray.push([date, action]);

        console.log('FeatureActionFactory:create: action = ', action);
      });
    });

    return dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }
}
