import { Actions } from "../components/storyboards/actions/Actions";
import { TextBoxProperties } from "../components/storyboards/actions/TextBox";
import { FeatureActionTableRow } from "../components/storyboards/tables/TableRows";
import { NumericalFeatures } from "../utils/storyboards/feature/NumericalFeatures";

export const ML_STORY_1: FeatureActionTableRow[] = [
  {
    feature: NumericalFeatures.ML_MIN,
    properties: {},
    rank: 5,
    actions: [
      {
        action: Actions.TEXT_BOX,
        properties: {
          title: "{DATE}",
          message:
            "The worst accuracy: ${MEAN_TRAIN_ACCURACY}% [${MEAN_TRAIN_ACCURACY}%]",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
  {
    feature: NumericalFeatures.ML_MAX,
    properties: {},
    rank: 7,
    actions: [
      {
        action: Actions.TEXT_BOX,
        properties: {
          message:
            "The best accuracy: ${MEAN_TRAIN_ACCURACY}% [${MEAN_TRAIN_ACCURACY}%]",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
  {
    feature: NumericalFeatures.ML_CURRENT,
    properties: {},
    rank: 7,
    actions: [
      {
        action: Actions.TEXT_BOX,
        properties: {
          message:
            "The current testing accuracy: ${MEAN_TRAIN_ACCURACY}% [${MEAN_TRAIN_ACCURACY}%]",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
  {
    feature: NumericalFeatures.ML_LAST,
    properties: {},
    rank: 7,
    actions: [
      {
        action: Actions.TEXT_BOX,
        properties: {
          message:
            "The current/last testing accuracy: ${MEAN_TRAIN_ACCURACY}% [${MEAN_TRAIN_ACCURACY}%]",
          title: "{DATE}",
          backgroundColor: "#d3d3d3",
          width: 300,
        } as TextBoxProperties,
      },
    ],
  },
];
