import { MSBFeature } from './MSBFeature';

export class NumericalFeature extends MSBFeature {
  protected height: number = 0;

  constructor() {
    super();
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  getHeight(): number {
    return this.height;
  }
}
