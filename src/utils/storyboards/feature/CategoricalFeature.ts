import { CategoricalFeatures } from "./CategoricalFeatures";
import { Feature } from "./Feature";

export class CategoricalFeature extends Feature {
  protected description: string;

  constructor(
    date: Date,
    description: string,
    type: CategoricalFeatures,
    rank: number
  ) {
    super(date);
    this.description = description;
    this.type = type;
    this.rank = rank;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  getDescription() {
    return this.description;
  }
}
