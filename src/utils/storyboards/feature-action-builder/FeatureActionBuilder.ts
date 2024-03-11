import { TimeseriesDataType } from "../data-processing/TimeseriesDataType";
import { MLTimeseriesDataType } from "../data-processing/MLTimeseriesDataType";
import { AbstractFeature } from "../feature/AbstractFeature";
import { ActionFactory } from "../../../components/storyboards/actions/ActionFactory";
import {
  ActionTableRowType,
  FeatureActionTableRowType as FeatureActionTableRowType,
} from "../../../components/storyboards/tables/FeatureActionTableRowType";

import {
  DateActionMapType,
  DateFeaturesMapType,
  FeatureActionMapType,
} from "./FeatureActionMapsType";
import { setOrUpdateMap } from "../../common";
import { FeatureFactory } from "../feature/FeatureFactory";

export class FeatureActionBuilder {
  private _data: TimeseriesDataType[] | MLTimeseriesDataType[];
  private _table: FeatureActionTableRowType[];
  private _properties: any;
  private _name = "";

  constructor() {}

  public properties(properties: any) {
    this._properties = properties;
    return this;
  }

  public table(table: FeatureActionTableRowType[]) {
    this._table = table;
    return this;
  }

  public data(data: TimeseriesDataType[] | MLTimeseriesDataType[]) {
    this._data = data;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  public build() {
    const dateFeaturesMap: DateFeaturesMapType = new Map();
    const dataActionsMap: DateActionMapType = new Map();
    const featureActionMap: FeatureActionMapType = new Map();

    const featureFactory = new FeatureFactory().data(this._data);

    this._table.forEach((row: FeatureActionTableRowType) => {
      // prettier-ignore
      // console.log("FeatureActionTableTranslator: feature = ", d.feature, ", properties = ", d.properties);
      const features: AbstractFeature[] = featureFactory.detect(
        row.feature,
        row.properties,
      );
      // prettier-ignore
      console.log("FeatureActionTableTranslator: features = ", features);

      const actionFactory = new ActionFactory();
      let action;

      row.actions.forEach((rowIn: ActionTableRowType) => {
        // prettier-ignore
        // console.log("FeatureActionTableTranslator: action = ", d1.action,  ", properties = ", d1.properties);
        // const action = actionFactory.create(rowIn.action, rowIn.properties);
        // prettier-ignore
        // console.log("FeatureActionTableTranslator: action = ", action);
        action = actionFactory.createComposite(rowIn.action, rowIn.properties);
      });
      console.log("FeatureActionBuilder: action = ", action);

      features.forEach((feature: AbstractFeature) => {
        setOrUpdateMap(dateFeaturesMap, feature.date, feature);
        featureActionMap.set(feature, action);
        dataActionsMap.set(feature.date, action);
      });
    });

    return dataActionsMap;
  }
}
