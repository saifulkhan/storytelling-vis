import { Plot } from "../../../components/storyboards/plots/Plot";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import {
  MLTimeseriesData,
  TimeSeriesPoint,
} from "../data-processing/TimeseriesPoint";
import { DateActionArray } from "../feature-action/FeatureActionTypes";

export abstract class MSBWorkflow {
  protected svg: SVGSVGElement;
  protected data: TimeSeriesPoint[] | MLTimeseriesData[];
  protected table: FeatureActionTableRow[] = [];
  protected name: string;
  protected plot: Plot | null = null;
  protected actions: DateActionArray | null = null;

  constructor() {}
  public abstract setData(data: TimeSeriesPoint[] | MLTimeseriesData[]): void;
  public abstract setNFATable(table: FeatureActionTableRow[]): this;
  public abstract setCFATable(table: any[]): this;
  public abstract setName(name: string): this;
  public abstract setCanvas(svg: SVGGElement): this;
  public abstract create(): this;
}
