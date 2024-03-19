import { TimeseriesData } from "../data-processing/TimeseriesData";
import { Feature } from "../feature/Feature";
import { ActionFactory } from "../../../components/storyboards/actions/ActionFactory";
import {
  ActionTableRow,
  FeatureActionTableRow as FeatureActionTableRow,
} from "../../../components/storyboards/tables/FeatureActionTableRow";
import { FeatureFactory } from "../feature/FeatureFactory";
import { Action } from "../../../components/storyboards/actions/Action";
import { DateActionArray } from "./FeatureActionTypes";
import {
  FeatureSearchProps,
  defaultFeatureSearchProps,
} from "../feature/FeatureSearchProps";

export class FeatureActionCreate {
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
    const actionFactory = new ActionFactory();
    const featureFactory = new FeatureFactory()
      .setProps(this.props)
      .setData(this.data);

    console.log("FeatureActionCreate:create: data: ", this.data);

    this.table.forEach((row: FeatureActionTableRow) => {
      // prettier-ignore
      console.log("FeatureActionCreate:create: row = ", row);

      //
      // search features
      //
      const features: Feature[] = featureFactory.search(
        row.feature,
        row.properties,
        row.rank
      );
      // prettier-ignore
      console.log("FeatureActionCreate:create: feature:", row.feature, ", features = ", features);

      //
      // create actions of each features
      //
      features.forEach((feature: Feature) => {
        let actions: Action[] = [];
        row.actions.forEach((rowIn: ActionTableRow) => {
          //
          // create action
          //
          const action = actionFactory
            .create(rowIn.action, rowIn.properties)
            ?.setFeatureType(feature?.getType());
          actions.push(action);
          // prettier-ignore
          // console.log("FeatureActionCreate: action = ", action);
        });

        //
        // group all actions of the feature
        //
        const action: Action = actionFactory
          .group(actions)
          ?.setFeatureType(feature?.getType());
        dataActionArray.push([feature.date, action]);

        console.log("FeatureActionCreate:create: action = ", action);
      });
    });

    return dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }
}
