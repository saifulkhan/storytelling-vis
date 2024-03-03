import { TimeseriesDataType } from "./TimeseriesDataType";
import { AbstractFeature, FeaturesType } from "../feature/AbstractFeature";
import { ActionBuilder } from "./ActionBuilder";
import {
  ActionTableRowType,
  FeatureActionTableRowType as FeatureActionTableRowType,
} from "../../../components/storyboards/tables/FeatureActionTableRowType";
import {
  TimeseriesFeatureDetector,
  TimeseriesFeatureDetectorProperties,
} from "../feature/TimeseriesFeatureDetector";
import { ActionsType } from "src/components/storyboards/actions/AbstractAction";
import {
  DateActionsMap,
  DateFeaturesMap,
  FeatureActionsMap,
} from "./FeatureActionMaps";
import { setOrUpdateMap } from "./common";

export class FeatureActionTableTranslator {
  private _data: TimeseriesDataType[];
  private _table: FeatureActionTableRowType[];
  private _properties: TimeseriesFeatureDetectorProperties;

  constructor(
    table: FeatureActionTableRowType[],
    data: TimeseriesDataType[],
    properties: TimeseriesFeatureDetectorProperties,
  ) {
    this._table = table;
    this._data = data;
    this._properties = properties;
  }

  public translate() {
    const dateFeaturesMap: DateFeaturesMap = new Map();
    const dataActionsMap: DateActionsMap = new Map();
    const featureActionMap: FeatureActionsMap = new Map();

    const featureDetector = new TimeseriesFeatureDetector(
      this._data,
      this._properties,
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
