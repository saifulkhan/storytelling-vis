import { MSBAction } from "src/components/actions/MSBAction";
import { MSBFeature } from "../utils/feature-action/MSBFeature";

export type DateFeaturesMap = Map<Date, MSBFeature[]>;
export type DateActionArray = [Date, MSBAction][];
export type FeatureActionMap = Map<MSBFeature, MSBAction>;
