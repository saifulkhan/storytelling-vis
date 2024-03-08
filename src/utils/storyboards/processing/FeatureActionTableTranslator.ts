import {
  ML_TimeseriesDataType,
  TimeseriesDataType,
} from "./TimeseriesDataType";
import { AbstractFeature, FeaturesType } from "../feature/AbstractFeature";
import { ActionBuilder } from "./ActionBuilder";
import {
  ActionTableRowType,
  FeatureActionTableRowType as FeatureActionTableRowType,
} from "../../../components/storyboards/tables/FeatureActionTableRowType";
import {
  TimeseriesFeatureDetector,
  FeatureDetectorProperties,
} from "../feature/TimeseriesFeatureDetector";
import {
  DateActionsMap,
  DateFeaturesMap,
  FeatureActionsMap,
} from "./FeatureActionMaps";
import { setOrUpdateMap } from "./common";
import { ActionsType } from "../../../components/storyboards/actions/AbstractAction";

export class FeatureActionTableTranslator {
  private _data: TimeseriesDataType[] | ML_TimeseriesDataType[];
  private _table: FeatureActionTableRowType[];
  private _properties: FeatureDetectorProperties;

  constructor() {}

  public properties(properties: FeatureDetectorProperties) {
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
    const dateFeaturesMap: DateFeaturesMap = new Map();
    const dataActionsMap: DateActionsMap = new Map();
    const featureActionMap: FeatureActionsMap = new Map();

    const featureDetector = new TimeseriesFeatureDetector(
      this._data,
      this._properties
    );
    const actionBuilder = new ActionBuilder();

    this._table.forEach((row: FeatureActionTableRowType) => {
      // prettier-ignore
      // console.log("FeatureActionTableTranslator: feature = ", d.feature, ", properties = ", d.properties);
      const features: FeaturesType = featureDetector.detect(
        row.feature,
        row.properties,
      );
      // prettier-ignore
      // console.log("FeatureActionTableTranslator: features = ", features);

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
