import { ActionEnum } from "../components/storyboards/actions/ActionEnum";
import { CircleProperties } from "../components/storyboards/actions/Circle";
import { ConnectorProperties } from "../components/storyboards/actions/Connector";
import { DotProperties } from "../components/storyboards/actions/Dot";
import { TextBoxProperties } from "../components/storyboards/actions/TextBox";
import { FeatureActionTableRowType } from "../components/storyboards/tables/FeatureActionTableRowType";
import { NumericalFeatureEnum } from "../utils/storyboards/feature/NumericalFeatureEnum";
import { PeakProperties } from "../utils/storyboards/feature/Peak";
import { SlopeProperties } from "../utils/storyboards/feature/Slope";

export const featureActionTableStory1: FeatureActionTableRowType[] = [
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
          title: "{DATE}",
          message: "On {DATE}, number of cases peaked at {VALUE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },

      {
        action: ActionEnum.CONNECTOR,
        properties: {
          stroke: "black",
          opacity: 0.6,
        } as ConnectorProperties,
      },
      {
        action: ActionEnum.DOT,
        properties: {
          color: "red",
          size: 5,
          strokeWidth: 2,
          opacity: 0.6,
        } as DotProperties,
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
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
      {
        action: ActionEnum.CONNECTOR,
        properties: { stroke: "black", opacity: 0.6 } as ConnectorProperties,
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
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
      {
        action: ActionEnum.CONNECTOR,
        properties: { stroke: "black", opacity: 0.6 } as ConnectorProperties,
      },
    ],
  },
];
