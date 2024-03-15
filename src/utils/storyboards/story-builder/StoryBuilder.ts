import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import {
  MLTimeseriesData,
  TimeseriesData,
} from "../data-processing/TimeseriesData";

export abstract class StoryBuilder {
  protected _initPromise: Promise<void>;
  protected _svg: SVGSVGElement;
  protected _data: TimeseriesData[] | MLTimeseriesData[];
  protected _table: FeatureActionTableRow[] = [];
  protected _name: string;

  constructor() {
    this._initPromise = this.initialize();
  }

  protected async initialize(): Promise<void> {
    await this.data();
    await this.table();
  }

  waitForInit(): Promise<void> {
    return this._initPromise;
  }

  protected abstract data(): void;
  protected abstract table(): void;
  public abstract names(): string[];
  public abstract name(name: string): this;
  public abstract selector(id: string): this;
  public abstract build(name: string): this;
}
