import { TimeSeriesData, TimeSeriesPoint } from 'src/types/TimeSeriesPoint';
import { MSBFeature } from 'src/utils/feature-action/MSBFeature';
import { MSBActionFactory } from 'src/components/actions/MSBActionFactory';
import {
  FeatureActionTableRow,
  ActionTableRow,
  FeatureActionTableData,
} from 'src/components/tables/FeatureActionTableRow';
import { MSBFeatureFactory } from 'src/utils/feature-action/MSBFeatureFactory';
import { MSBAction } from 'src/components/actions/MSBAction';
import { TimelineMSBActions } from 'src/types/TimelineMSBActions';
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from 'src/utils/feature-action/FeatureSearchProps';
import { getTimeSeriesPointByDate } from '../common';

export class MSBFeatureActionFactory {
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
    const dataActionArray: TimelineMSBActions = [];
    const actionFactory = new MSBActionFactory();
    const featureFactory = new MSBFeatureFactory()
      .setProps(this.props)
      .setData(this.data);

    console.log('MSBFeatureActionFactory:create: data: ', this.data);

    this.table.forEach((row: FeatureActionTableRow) => {
      console.log('MSBFeatureActionFactory:create: row = ', row);

      //
      // search features
      //
      const searchResult = featureFactory.search(
        row.feature,
        row.properties,
        row.rank,
      );
      const features: MSBFeature[] = searchResult || [];
      // prettier-ignore
      console.log("MSBFeatureActionFactory:create: feature:", row.feature, ", features = ", features);

      //
      // create actions of each features
      //
      features.forEach((feature: MSBFeature) => {
        const date: Date = feature.getDate();
        const point: TimeSeriesPoint | undefined = getTimeSeriesPointByDate(
          date,
          this.data,
        );

        let actions: MSBAction[] = [];
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
          // console.log("MSBFeatureActionFactory: action = ", action);
        });

        //
        // group all actions of the feature
        //
        const action: MSBAction = actionFactory
          .group(actions)
          ?.setFeatureType(feature?.getType());

        dataActionArray.push([date, action]);

        console.log('MSBFeatureActionFactory:create: action = ', action);
      });
    });

    return dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }
}
