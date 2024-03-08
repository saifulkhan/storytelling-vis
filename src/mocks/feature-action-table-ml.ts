import { ActionEnum } from "../components/storyboards/actions/ActionEnum";
import { TextBoxProperties } from "../components/storyboards/actions/TextBox";
import { FeatureActionTableRowType } from "../components/storyboards/tables/FeatureActionTableRowType";
import { NumericalFeatureEnum } from "../utils/storyboards/feature/NumericalFeatureEnum";

export const multiVariateStory: FeatureActionTableRowType[] = [
  {
    feature: NumericalFeatureEnum.ML_MIN,
    properties: {},
    rank: 5,
    actions: [
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          title: "{DATE}",
          message:
            "The worst accuracy: ${MEAN_TRAIN_ACCURACY}% [{MEAN_TRAIN_ACCURACY}%]",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
  {
    feature: NumericalFeatureEnum.ML_MAX,
    properties: {},
    rank: 7,
    actions: [
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          message:
            "The best accuracy: ${MEAN_TRAIN_ACCURACY}% [{MEAN_TRAIN_ACCURACY}%]",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
  {
    feature: NumericalFeatureEnum.CURRENT,
    properties: {},
    rank: 7,
    actions: [
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          message:
            "The current testing accuracy: ${MEAN_TRAIN_ACCURACY}% [{MEAN_TRAIN_ACCURACY}%]",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
  {
    feature: NumericalFeatureEnum.LAST,
    properties: {},
    rank: 7,
    actions: [
      {
        action: ActionEnum.TEXT_BOX,
        properties: {
          message:
            "The current/last testing accuracy: ${MEAN_TRAIN_ACCURACY}% [{MEAN_TRAIN_ACCURACY}%]",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
];
