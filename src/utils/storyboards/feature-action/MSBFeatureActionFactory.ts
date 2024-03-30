import { TimeseriesData } from "../data-processing/TimeseriesData";
import { MSBFeature } from "../feature/MSBFeature";
import { MSBActionFactory } from "../../../components/storyboards/actions/MSBActionFactory";
import {
  ActionTableRow,
  FeatureActionTableRow as FeatureActionTableRow,
} from "../../../components/storyboards/tables/FeatureActionTableRow";
import { MSBFeatureFactory } from "../feature/MSBFeatureFactory";
import { MSBAction } from "../../../components/storyboards/actions/MSBAction";
import { DateActionArray } from "./FeatureActionTypes";
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from "../feature/FeatureSearchProps";

export class MSBMSBFeatureActionFactory {
  private data: TimeseriesData[];
  private table: FeatureActionTableRow[];
  private props: FeatureSearchProps;

  constructor() {}

  public setProps(props: FeatureSearchProps) {
    this.props = { ...defaultFeatureSearchProps, ...props };
    return this;
  }

  public setTable(table: FeatureActionTableRow[]) {
    this.table = table;
    return this;
  }

  public setData(data: TimeseriesData[]) {
    this.data = data;
    return this;
  }

  public create() {
    const dataActionArray: DateActionArray = [];
    const actionFactory = new MSBActionFactory();
    const featureFactory = new MSBFeatureFactory()
      .setProps(this.props)
      .setData(this.data);

    console.log("MSBFeatureActionFactory:create: data: ", this.data);

    this.table.forEach((row: FeatureActionTableRow) => {
      // prettier-ignore
      console.log("MSBFeatureActionFactory:create: row = ", row);

      //
      // search features
      //
      const features: MSBFeature[] = featureFactory.search(
        row.feature,
        row.properties,
        row.rank
      );
      // prettier-ignore
      console.log("MSBFeatureActionFactory:create: feature:", row.feature, ", features = ", features);

      //
      // create actions of each features
      //
      features.forEach((feature: MSBFeature) => {
        let actions: MSBAction[] = [];
        row.actions.forEach((rowIn: ActionTableRow) => {
          //
          // create action
          //
          const action = actionFactory
            .create(rowIn.action, rowIn.properties)
            ?.setFeatureType(feature?.getType());
          actions.push(action);
          // prettier-ignore
          // console.log("MSBFeatureActionFactory: action = ", action);
        });

        //
        // group all actions of the feature
        //
        const action: MSBAction = actionFactory
          .group(actions)
          ?.setFeatureType(feature?.getType());
        dataActionArray.push([feature.date, action]);

        console.log("MSBFeatureActionFactory:create: action = ", action);
      });
    });

    return dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }
}
