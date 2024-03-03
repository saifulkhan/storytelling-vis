import * as d3 from "d3";
import { TimeseriesDataType } from "../processing/TimeseriesDataType";

export abstract class AbstractWorkflow {
  protected _initPromise: Promise<void>;
  protected _allData: Record<string, TimeseriesDataType[]> = {};
  protected _data: TimeseriesDataType[];
  protected _svg: SVGSVGElement;
  protected _key: string;

  constructor() {
    this._initPromise = this.initialize();
  }

  protected async initialize(): Promise<void> {
    await this.load();
  }

  waitForInit(): Promise<void> {
    return this._initPromise;
  }

  public draw(selector: string) {
    this._svg = d3
      .select(selector)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 500)
      .node();

    console.log("Workflow:draw: svg = ", this._svg);
  }

  keys(): string[] {
    return Object.keys(this._allData).sort();
  }

  filter(key: string) {
    this._key = key;
    this._data = this._allData[key];
    this.create();
  }

  protected abstract load();
  protected abstract create();
}
