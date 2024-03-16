import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Min extends NumericalFeature {
  constructor(
    date: Date,
    height: number,
    rank?: number,
    metric?: string,
    start?: Date,
    end?: Date
  ) {
    super(date, height, rank, metric, start, end);
    this.type = NumericalFeatures.MIN;
  }
}
