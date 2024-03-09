import { ActionsType } from "src/components/storyboards/actions/AbstractAction";
import {
  AbstractFeature,
  FeaturesType,
} from "src/utils/storyboards/feature/AbstractFeature";

export type DateFeaturesMap = Map<Date, FeaturesType>;
export type DateActionsMap = Map<Date, ActionsType[]>;
export type FeatureActionsMap = Map<AbstractFeature, ActionsType[]>;
