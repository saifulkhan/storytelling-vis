export abstract class AbstractWorkflow {
  protected _initPromise: Promise<void>;
  protected _svg: SVGSVGElement;

  constructor() {
    this._initPromise = this.initialize();
  }

  protected async initialize(): Promise<void> {
    await this.data();
  }

  waitForInit(): Promise<void> {
    return this._initPromise;
  }

  protected abstract data(): void;
  public abstract keys(): string[];
  public abstract create(key: string): this;
  public abstract selector(id: string): this;
}
