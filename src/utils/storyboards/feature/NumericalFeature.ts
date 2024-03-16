import { Feature } from "./Feature";

export class NumericalFeature extends Feature {
  protected height: number;

  constructor(
    date: Date,
    height: number,
    rank?: number,
    metric?: string,
    start?: Date,
    end?: Date
  ) {
    super(date, rank, metric, start, end);
    this.height = height;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  getHeight(): number {
    return this.height;
  }
}
