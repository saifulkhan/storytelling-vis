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

export class FeatureActionBuilder {
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

  public build() {
    const dataActionArray: DateActionArray = [];
    const actionFactory = new ActionFactory();
    const featureFactory = new FeatureFactory()
      .setProps(this.props)
      .setData(this.data);

    // const featureActionMap: FeatureActionMap = new Map();
    // const dateFeaturesMap: DateFeaturesMap = new Map();
    console.log("FeatureActionBuilder:build: data: ", this.data);

    this.table.forEach((row: FeatureActionTableRow) => {
      // prettier-ignore
      console.log("FeatureActionBuilder:build: row = ", row);
      const features: Feature[] = featureFactory.search(
        row.feature,
        row.properties,
        row.rank
      );
      // prettier-ignore
      console.log("FeatureActionBuilder:build: feature:", row.feature, ", features = ", features);

      features.forEach((feature: Feature) => {
        let actions: Action[] = [];
        row.actions.forEach((rowIn: ActionTableRow) => {
          // const action = actionFactory.create(rowIn.action, rowIn.properties);
          // prettier-ignore
          // console.log("FeatureActionBuilder: action = ", action);
          actions.push(actionFactory.create(rowIn.action, rowIn.properties));
        });

        const action: Action = actionFactory.group(actions);
        console.log("FeatureActionBuilder:build: action = ", action);
        // setOrUpdateMap(dateFeaturesMap, feature.date, feature);
        // featureActionMap.set(feature, action);
        dataActionArray.push([feature.date, action]);
      });
    });

    return dataActionArray.sort((a, b) => b[0].getTime() - a[0].getTime());
  }
}
