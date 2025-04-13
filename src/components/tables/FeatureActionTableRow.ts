import { Condition, MSBFeatureName } from "../../utils/feature-action";
import {
  CircleProps,
  DotProps,
  ConnectorProps,
  TextBoxProps,
  MSBActionName,
} from "../actions";

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

export type FeatureActionTableData = FeatureActionTableRow[];