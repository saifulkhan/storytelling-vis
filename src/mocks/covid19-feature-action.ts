import { ActionEnum } from "src/components/storyboards/actions/ActionEnum";
import { CircleProperties } from "src/components/storyboards/actions/Circle";
import { ConnectorProperties } from "src/components/storyboards/actions/Connector";
import { DotProperties } from "src/components/storyboards/actions/Dot";
import { TextBoxProperties } from "src/components/storyboards/actions/TextBox";
import { NumericalFeatureEnum } from "src/utils/storyboards/feature/NumericalFeatureEnum";
import { PeakProperties } from "src/utils/storyboards/feature/Peak";
import { SlopeProperties } from "src/utils/storyboards/feature/Slope";
import { FeatureActionTableRowType } from "src/components/storyboards/tables/FeatureActionTableRowType";

export const featureActionTable1: FeatureActionTableRowType[] = [
  {
    feature: NumericalFeatureEnum.PEAK,
    properties: {} as PeakProperties,
    rank: 5,
    actions: [
      {
        action: ActionEnum.CIRCLE,
        properties: {
          size: 10,
          strokeWidth: 2,
          opacity: 0.6,
          color: "#FFA500",
        } as CircleProperties,
      },
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          message: "On {DATE}, number of cases peaked at {VALUE}",
        } as TextBoxProperties,
      },

      {
        action: ActionEnum.CONNECTOR,
        properties: {} as ConnectorProperties,
      },
      {
        action: ActionEnum.DOT,
        properties: { color: "#FFA500" } as DotProperties,
      },
    ],
  },

  {
    feature: NumericalFeatureEnum.SLOPE,
    properties: { gt: 100 } as SlopeProperties,
    rank: 7,
    actions: [
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          message:
            "By {DATE}, the number of cases continued to climb higher in {REGION}.",
        } as TextBoxProperties,
      },
      {
        action: ActionEnum.CONNECTOR,
        properties: {} as ConnectorProperties,
      },
    ],
  },
  {
    feature: NumericalFeatureEnum.SLOPE,
    properties: { gt: -1, lt: 1, ne: 0 } as SlopeProperties,
    rank: 7,
    actions: [
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          message:
            "By {DATE}, the number of cases remained low. We should continue to be vigilant",
        } as TextBoxProperties,
      },
      {
        action: ActionEnum.CONNECTOR,
        properties: {} as ConnectorProperties,
      },
    ],
  },
];
