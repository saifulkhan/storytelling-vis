import { Condition } from "../../../utils/storyboards/feature/Condition";
import { NumericalFeatures } from "../../../utils/storyboards/feature/NumericalFeatures";
import { Actions } from "../actions/Actions";
import { CircleProperties } from "../actions/Circle";
import { ConnectorProperties } from "../actions/Connector";
import { DotProperties } from "../actions/Dot";
import { TextBoxProperties } from "../actions/TextBox";

export type ActionTableRow = {
  action: Actions;
  properties:
    | CircleProperties
    | ConnectorProperties
    | DotProperties
    | TextBoxProperties;
};

export type FeatureActionTableRow = {
  feature: NumericalFeatures;
  properties: Condition;
  rank: number;
  actions: ActionTableRow[];
  comment?: string;
};
