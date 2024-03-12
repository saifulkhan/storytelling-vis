import { Actions } from "../components/storyboards/actions/Actions";
import { CircleProperties } from "../components/storyboards/actions/Circle";
import { ConnectorProperties } from "../components/storyboards/actions/Connector";
import { DotProperties } from "../components/storyboards/actions/Dot";
import { TextBoxProperties } from "../components/storyboards/actions/TextBox";
import { FeatureActionTableRow } from "../components/storyboards/tables/TableRows";
import { Condition } from "../utils/storyboards/feature/Condition";
import { NumericalFeatures } from "../utils/storyboards/feature/NumericalFeatures";

export const COVID19_STORY_1: FeatureActionTableRow[] = [
  {
    feature: NumericalFeatures.PEAK,
    properties: {} as Condition,
    rank: 5,
    actions: [
      {
        action: Actions.CIRCLE,
        properties: {
          size: 10,
          strokeWidth: 2,
          opacity: 0.6,
          color: "green",
        } as CircleProperties,
      },
      {
        action: Actions.TEXT_BOX,
        properties: {
          title: "${date}",
          message: "PEAK- ${date} - ${value}- ${name}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },

      {
        action: Actions.CONNECTOR,
        properties: {
          stroke: "black",
          opacity: 0.6,
        } as ConnectorProperties,
      },
      {
        action: Actions.DOT,
        properties: {
          color: "green",
          size: 5,
          strokeWidth: 2,
          opacity: 0.6,
        } as DotProperties,
      },
    ],
  },
  {
    feature: NumericalFeatures.MAX,
    properties: {} as Condition,
    rank: 5,
    actions: [
      {
        action: Actions.CIRCLE,
        properties: {
          size: 10,
          strokeWidth: 2,
          opacity: 0.6,
          color: "red",
        } as CircleProperties,
      },
      {
        action: Actions.TEXT_BOX,
        properties: {
          title: "${date}",
          message: "MAX- ${date} - ${value} - ${name}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },

      {
        action: Actions.CONNECTOR,
        properties: {
          stroke: "black",
          opacity: 0.6,
        } as ConnectorProperties,
      },
      {
        action: Actions.DOT,
        properties: {
          color: "red",
          size: 5,
          strokeWidth: 2,
          opacity: 0.6,
        } as DotProperties,
      },
    ],
  },

  /*
  {
    feature: NumericalFeatures.SLOPE,
    properties: { gt: 100 } as Condition,
    rank: 7,
    actions: [
      {
        action: Actions.TEXT_BOX,
        properties: {
          message:
            "By {DATE}, the number of cases continued to climb higher in {REGION}.",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
      {
        action: Actions.CONNECTOR,
        properties: { stroke: "black", opacity: 0.6 } as ConnectorProperties,
      },
    ],
  },
  {
    feature: NumericalFeatures.SLOPE,
    properties: { gt: -1, lt: 1, ne: 0 } as Condition,
    rank: 7,
    actions: [
      {
        action: Actions.TEXT_BOX,
        properties: {
          message:
            "By {DATE}, the number of cases remained low. We should continue to be vigilant",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
      {
        action: Actions.CONNECTOR,
        properties: { stroke: "black", opacity: 0.6 } as ConnectorProperties,
      },
    ],
  },
  */
];
