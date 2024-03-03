import { AbstractFeature } from "./AbstractFeature";
import { CategoricalFeatureEnum } from "./CategoricalFeatureEnum";

export class CategoricalFeature extends AbstractFeature {
  protected _description: string;

  constructor(
    date,
    description = undefined,
    type = CategoricalFeatureEnum.DEFAULT,
    rank = undefined,
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
