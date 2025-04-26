import { Condition, FeatureName } from '../../utils/feature-action';
import {
  CircleProps,
  DotProps,
  ConnectorProps,
  TextBoxProps,
  ActionName,
} from '../actions';

export type ActionTableRow = {
  action: ActionName;
  properties: CircleProps | ConnectorProps | DotProps | TextBoxProps;
};

export type FeatureActionTableRow = {
  feature: FeatureName;
  properties: Condition;
  rank: number;
  actions: ActionTableRow[];
  comment?: string;
};

export type FeatureActionTableData = FeatureActionTableRow[];
