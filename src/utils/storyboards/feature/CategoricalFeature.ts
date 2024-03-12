import { Feature } from "./Feature";
import { CategoricalFeatures } from "./CategoricalFeatures";

export class CategoricalFeature extends Feature {
  protected _description: string;

  constructor(
    date: Date,
    description = undefined,
    type = CategoricalFeatures.DEFAULT,
    rank = undefined
  ) {
    super(date);
    this._type = type;
    this._description = description;
    this._rank = rank;
  }

  get description() {
    if (!this._description) throw "Description not set for categorical event.";
    return this._description;
  }
}
