import { Action } from "../../../components/storyboards/actions/Action";
import { Feature } from "../feature/Feature";

export type DateFeaturesMap = Map<Date, Feature[]>;
export type DateActionArray = [Date, Action][];
export type FeatureActionMap = Map<Feature, Action>;
