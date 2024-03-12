import {
  MLTimeseriesData,
  TimeseriesData,
} from "../data-processing/TimeseriesData";
import { Feature } from "../feature/Feature";
import { ActionFactory } from "../../../components/storyboards/actions/ActionFactory";
import {
  ActionTableRow,
  FeatureActionTableRow as FeatureActionTableRow,
} from "../../../components/storyboards/tables/TableRows";

import { setOrUpdateMap } from "../../common";
import { FeatureFactory } from "../feature/FeatureFactory";
import { Action } from "../../../components/storyboards/actions/Action";
import { DateActionArray } from "./FeatureActionTypes";

export class FeatureActionBuilder {
  private _data: TimeseriesData[] | MLTimeseriesData[];
  private _table: FeatureActionTableRow[];
  private _properties: any;
  private _name = "";

  constructor() {}

  public properties(properties: any) {
    this._properties = properties;
    return this;
  }

  public table(table: FeatureActionTableRow[]) {
    this._table = table;
    return this;
  }

  public data(data: TimeseriesData[] | MLTimeseriesData[]) {
    this._data = data;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  public build() {
    const dataActionArray: DateActionArray = [];
    const actionFactory = new ActionFactory();
    const featureFactory = new FeatureFactory().data(this._data);

    // const featureActionMap: FeatureActionMap = new Map();
    // const dateFeaturesMap: DateFeaturesMap = new Map();

    this._table.forEach((row: FeatureActionTableRow) => {
      // prettier-ignore
      console.log("FeatureActionBuilder: row = ", row);
      const features: Feature[] = featureFactory.detect(
        row.feature,
        row.properties
      );
      // prettier-ignore
      console.log("FeatureActionBuilder: features = ", features);

      features.forEach((feature: Feature) => {
        let actions: Action[] = [];
        row.actions.forEach((rowIn: ActionTableRow) => {
          // const action = actionFactory.create(rowIn.action, rowIn.properties);
          // prettier-ignore
          // console.log("FeatureActionBuilder: action = ", action);
          actions.push(actionFactory.create(rowIn.action, rowIn.properties));
        });

        const action: Action = actionFactory.compose(actions);
        console.log("FeatureActionBuilder: action = ", action);
        // setOrUpdateMap(dateFeaturesMap, feature.date, feature);
        // featureActionMap.set(feature, action);
        dataActionArray.push([feature.date, action]);
      });
    });

    return dataActionArray;
  }
}
