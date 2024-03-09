import { TimeseriesDataType } from "../data-processing/TimeseriesDataType";
import { MLTimeseriesDataType } from "../data-processing/MLTimeseriesDataType";
import { AbstractFeature } from "../feature/AbstractFeature";
import { ActionFactory } from "../../../components/storyboards/actions/ActionFactory";
import {
  ActionTableRowType,
  FeatureActionTableRowType as FeatureActionTableRowType,
} from "../../../components/storyboards/tables/FeatureActionTableRowType";

import {
  DateActionsMapType,
  DateFeaturesMapType,
  FeatureActionsMapType,
} from "./FeatureActionMapsType";
import { setOrUpdateMap } from "./common";
import { ActionsType } from "../../../components/storyboards/actions/AbstractAction";
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
    const dataActionsMap: DateActionsMapType = new Map();
    const featureActionMap: FeatureActionsMapType = new Map();

    const featureFactory = new FeatureFactory().data(this._data);
    const actionFactory = new ActionFactory();

    this._table.forEach((row: FeatureActionTableRowType) => {
      // prettier-ignore
      // console.log("FeatureActionTableTranslator: feature = ", d.feature, ", properties = ", d.properties);
      const features: AbstractFeature[] = featureFactory.detect(
        row.feature,
        row.properties,
      );
      // prettier-ignore
      console.log("FeatureActionTableTranslator: features = ", features);

      const actions: ActionsType = [];
      row.actions.forEach((rowIn: ActionTableRowType) => {
        // prettier-ignore
        // console.log("FeatureActionTableTranslator: action = ", d1.action,  ", properties = ", d1.properties);
        const action = actionFactory.create(rowIn.action, rowIn.properties);
        // prettier-ignore
        // console.log("FeatureActionTableTranslator: action = ", action);
        actions.push(action);
      });

      features.forEach((feature: AbstractFeature) => {
        setOrUpdateMap(dateFeaturesMap, feature.date, feature);
        setOrUpdateMap(featureActionMap, feature, actions);
        setOrUpdateMap(dataActionsMap, feature.date, actions);
      });
    });

    return dataActionsMap;
  }
}
