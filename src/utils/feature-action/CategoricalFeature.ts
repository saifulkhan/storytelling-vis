import { Feature } from './Feature';

export enum CategoricalFeatureName {
  LOCKDOWN = 'LOCKDOWN',
  LOCKDOWN_START = 'LOCKDOWN_START',
  LOCKDOWN_END = 'LOCKDOWN_END',
}

export class CategoricalFeature extends Feature {
  protected description: string = '';

  constructor() {
    super();
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  getDescription() {
    return this.description;
  }
}
