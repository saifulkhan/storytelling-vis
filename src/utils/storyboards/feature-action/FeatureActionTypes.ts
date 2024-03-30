import { MSBAction } from "../../../components/storyboards/actions/MSBAction";
import { MSBFeature } from "../feature/MSBFeature";

export type DateFeaturesMap = Map<Date, MSBFeature[]>;
export type DateActionArray = [Date, MSBAction][];
export type FeatureActionMap = Map<MSBFeature, MSBAction>;
