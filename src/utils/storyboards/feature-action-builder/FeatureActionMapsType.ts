import { AbstractAction } from "../../../components/storyboards/actions/AbstractAction";
import { AbstractFeature } from "../feature/AbstractFeature";

export type DateFeaturesMapType = Map<Date, AbstractFeature>;
export type DateActionMapType = Map<Date, AbstractAction>;
export type FeatureActionMapType = Map<AbstractFeature, AbstractAction>;
