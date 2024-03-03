import { CircleProperties } from "src/components/storyboards/actions/Circle";
import { ConnectorProperties } from "src/components/storyboards/actions/Connector";
import { DotProperties } from "src/components/storyboards/actions/Dot";
import { TextBoxProperties } from "src/components/storyboards/actions/TextBox";
import { PeakProperties } from "src/utils/storyboards/feature/Peak";
import { RaiseProperties } from "src/utils/storyboards/feature/Raise";
import { SlopeProperties } from "src/utils/storyboards/feature/Slope";
import { FallProperties } from "src/utils/storyboards/feature/Fall";
import { ActionEnum } from "src/components/storyboards/actions/ActionEnum";
import { NumericalFeatureEnum } from "src/utils/storyboards/feature/NumericalFeatureEnum";

export type ActionTableRowType = {
  action: ActionEnum;
  properties:
    | CircleProperties
    | ConnectorProperties
    | DotProperties
    | TextBoxProperties;
};

export type FeatureActionTableRowType = {
  feature: NumericalFeatureEnum;
  properties:
    | PeakProperties
    | RaiseProperties
    | SlopeProperties
    | FallProperties;
  rank: number;
  actions: ActionTableRowType[];
  comment?: string;
};
