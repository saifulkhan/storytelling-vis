import { CategoricalFeatureName } from './CategoricalFeatureName';
import { Condition } from './Condition';
import { NumericalFeatureName } from './NumericalFeatureName';
import { CircleProps } from './CircleProps';
import { DotProps } from './DotProps';
import { ConnectorProps } from './ConnectorProps';
import { TextBoxProps } from './TextBoxProps';
import { ActionName } from './ActionName';

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
