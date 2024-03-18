import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import {
  MLTimeseriesData,
  TimeseriesData,
} from "../data-processing/TimeseriesData";

export abstract class StoryBuilder {
  protected svg: SVGSVGElement;
  protected data: TimeseriesData[] | MLTimeseriesData[];
  protected table: FeatureActionTableRow[] = [];
  protected name: string;

  constructor() {}
  public abstract setData(data: TimeseriesData[] | MLTimeseriesData[]): void;
  public abstract setTableNFA(table: FeatureActionTableRow[]): this;
  // TODO: CFA
  public abstract setName(name: string): this;
  public abstract setCanvas(svg: SVGGElement): this;
  public abstract build(): this;
}
