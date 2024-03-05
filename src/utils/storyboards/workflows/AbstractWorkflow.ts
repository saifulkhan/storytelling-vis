import * as d3 from "d3";

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

  protected abstract data();
  public abstract create(key: string);

  public drawOn(selector: string) {
    this._svg = d3
      .select(selector)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 500)
      .node();

    console.log("Workflow:draw: svg = ", this._svg);
  }

  public abstract keys(): string[];
  public abstract key(key: string): void;
}
