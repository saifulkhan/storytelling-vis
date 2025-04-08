import { Condition } from "src/utils/feature-action/Condition";
import { MSBFeatureName } from "src/utils/feature-action/MSBFeatureName";
import { MSBActionName } from "src/components/actions/MSBActionName";
import { CircleProps } from "src/components/actions/Circle";
import { ConnectorProps } from "src/components/actions/Connector";
import { DotProps } from "src/components/actions/Dot";
import { TextBoxProps } from "src/components/actions/TextBox";

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
