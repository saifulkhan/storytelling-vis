import { Condition } from "../../../utils/feature-action/Condition";
import { MSBFeatureName } from "../../../utils/feature-action/MSBFeatureName";
import { MSBActionName } from "../actions/MSBActionName";
import { CircleProps } from "../actions/Circle";
import { ConnectorProps } from "../actions/Connector";
import { DotProps } from "../actions/Dot";
import { TextBoxProps } from "../actions/TextBox";

export type ActionTableRow = {
  action: MSBActionName;
  properties: CircleProps | ConnectorProps | DotProps | TextBoxProps;
};

export type FeatureActionTableRow = {
  feature: MSBFeatureName;
  properties: Condition;
  rank: number;
  actions: ActionTableRow[];
  comment?: string;
};
