import { TimeseriesDataType } from "./TimeseriesDataType";
import { ML_TimeseriesDataType } from "./ML_TimeseriesDataType";
import { AbstractFeature, FeaturesType } from "../feature/AbstractFeature";
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
import { FeatureProperties, FeatureFactory } from "../feature/FeatureFactory";

export class FeatureActionBuilder {
  private _data: TimeseriesDataType[] | ML_TimeseriesDataType[];
  private _table: FeatureActionTableRowType[];
  private _properties: FeatureProperties;

  constructor() {}

  public properties(properties: FeatureProperties) {
    this._properties = properties;
    return this;
  }

  public table(table: FeatureActionTableRowType[]) {
    this._table = table;
    return this;
  }

  public data(data: TimeseriesDataType[] | ML_TimeseriesDataType[]) {
    this._data = data;
    return this;
  }

  public translate() {
    const dateFeaturesMap: DateFeaturesMapType = new Map();
    const dataActionsMap: DateActionsMapType = new Map();
    const featureActionMap: FeatureActionsMapType = new Map();

    const featureSearch = new FeatureFactory(this._data, this._properties);
    const actionBuilder = new ActionFactory();

    this._table.forEach((row: FeatureActionTableRowType) => {
      // prettier-ignore
      // console.log("FeatureActionTableTranslator: feature = ", d.feature, ", properties = ", d.properties);
      const features: FeaturesType = featureSearch.detect(
        row.feature,
        row.properties,
      );
      // prettier-ignore
      console.log("FeatureActionTableTranslator: features = ", features);

      const actions: ActionsType = [];
      row.actions.forEach((rowIn: ActionTableRowType) => {
        // prettier-ignore
        // console.log("FeatureActionTableTranslator: action = ", d1.action,  ", properties = ", d1.properties);
        const action = actionBuilder.create(rowIn.action, rowIn.properties);
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
