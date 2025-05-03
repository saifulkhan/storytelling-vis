import { Feature } from './Feature';

export class NumericalFeature extends Feature {
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
