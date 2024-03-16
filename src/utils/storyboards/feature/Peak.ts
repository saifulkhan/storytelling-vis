import { NumericalFeature } from "./NumericalFeature";
import { NumericalFeatures } from "./NumericalFeatures";

export class Peak extends NumericalFeature {
  protected normHeight: number;
  protected normWidth: number;
  protected normDuration: number;

  constructor(
    date: Date,
    height: number,
    normWidth: number,
    normHeight: number,
    rank?: number,
    metric?: string,
    start?: Date,
    end?: Date
  ) {
    super(date, height, rank, metric, start, end);
    this.normWidth = normWidth;
    this.normHeight = normHeight;
    this.type = NumericalFeatures.PEAK;
  }

  setNormWidth(normWidth: number) {
    this.normWidth = normWidth;
    return this;
  }

  getNormWidth() {
    return this.normWidth;
  }

  setNormHeight(normHeight: number) {
    this.normHeight = normHeight;
    return this;
  }

  getNormHeight() {
    return this.normHeight;
  }

  setNormDuration(normDuration: number) {
    this.normDuration = normDuration;
    return this;
  }
  getNormDuration() {
    return this.normDuration;
  }
}
