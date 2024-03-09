import { ActionsType } from "../../../components/storyboards/actions/AbstractAction";
import { AbstractFeature } from "../feature/AbstractFeature";

export type DateFeaturesMapType = Map<Date, AbstractFeature>;
export type DateActionsMapType = Map<Date, ActionsType[]>;
export type FeatureActionsMapType = Map<AbstractFeature, ActionsType[]>;
