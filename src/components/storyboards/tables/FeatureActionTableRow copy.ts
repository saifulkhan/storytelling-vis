import { Condition } from "../../../utils/storyboards/feature/Condition";
import { FeatureType } from "../../../utils/storyboards/feature/FeatureType";
import { ActionType } from "../actions/ActionType";
import { CircleProps } from "../actions/Circle";
import { ConnectorProps } from "../actions/Connector";
import { DotProps } from "../actions/Dot";
import { TextBoxProps } from "../actions/TextBox";

export type ActionTableRow = {
  action: ActionType;
  properties: CircleProps | ConnectorProps | DotProps | TextBoxProps;
};

export type FeatureActionTableRow = {
  feature: FeatureType;
  properties: Condition;
  rank: number;
  actions: ActionTableRow[];
  comment?: string;
};
