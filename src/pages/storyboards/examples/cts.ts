import { readJSON } from "../../../services/data";
import { CategoricalFeature } from "../../../utils/storyboards/feature/CategoricalFeature";
import { CategoricalFeatures } from "../../../utils/storyboards/feature/CategoricalFeatures";
const TABLE =
  "/static/storyboards/feature-action-tables/categorical-feature.json";

export async function categoricalTable() {
  return await readJSON(TABLE);
}
