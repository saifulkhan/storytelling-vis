import {
  CategoricalFeatureName,
  Condition,
  NumericalFeatureName,
} from '../../types';
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
  feature: NumericalFeatureName | CategoricalFeatureName;
  properties: Condition;
  rank: number;
  actions: ActionTableRow[];
  comment?: string;
};

export type FeatureActionTableData = FeatureActionTableRow[];
