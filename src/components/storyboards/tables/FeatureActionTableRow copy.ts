import { Condition } from "../../../utils/storyboards/feature/Condition";
import { NumericalFeatures } from "../../../utils/storyboards/feature/NumericalFeatures";
import { Actions } from "../actions/Actions";
import { CircleProps } from "../actions/Circle";
import { ConnectorProps } from "../actions/Connector";
import { DotProps } from "../actions/Dot";
import { TextBoxProps } from "../actions/TextBox";

export type ActionTableRow = {
  action: Actions;
  properties: CircleProps | ConnectorProps | DotProps | TextBoxProps;
};

export type FeatureActionTableRow = {
  feature: NumericalFeatures;
  properties: Condition;
  rank: number;
  actions: ActionTableRow[];
  comment?: string;
};
