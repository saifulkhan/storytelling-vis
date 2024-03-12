export abstract class StoryBuilder {
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
  public abstract names(): string[];
  public abstract name(name: string): this;
  public abstract selector(id: string): this;
  public abstract build(name: string): this;
}
