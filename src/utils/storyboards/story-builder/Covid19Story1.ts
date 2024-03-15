import * as d3 from "d3";
import { readCSVFile, readJSONFile } from "../../../services/data";
import { NumericalFeature } from "../feature/NumericalFeature";
import { CategoricalFeature } from "../feature/CategoricalFeature";
import { TimeseriesData } from "../data-processing/TimeseriesData";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { LinePlot } from "../../../components/storyboards/plots/LinePlot";
import { StoryBuilder } from "./StoryBuilder";
import { DateActionArray } from "../feature-action-builder/FeatureActionTypes";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";

const DATA = "/static/storyboards/newCasesByPublishDateRollingSum.csv";
const TABLE = "/static/storyboards/feature-action-tables/covid-19-story-1.json";
const WINDOW = 3;

export class Covid19Story1 extends StoryBuilder {
  protected _allRegionData: Record<string, TimeseriesData[]> = {};

  private _nts: NumericalFeature[];
  private _cts: CategoricalFeature[];

  constructor() {
    super();
  }

  protected async data() {
    const csv: any[] = await readCSVFile(DATA);

    csv.forEach((row) => {
      const region = row.areaName;
      const date = new Date(row.date);
      const cases = +row.newCasesByPublishDateRollingSum;

      if (!this._allRegionData[region]) {
        this._allRegionData[region] = [];
      }

      this._allRegionData[region].push({ date: date, y: cases });
    });

    for (const region in this._allRegionData) {
      this._allRegionData[region].sort(
        (d1: TimeseriesData, d2: TimeseriesData) =>
          d1.date.getTime() - d2.date.getTime()
      );
    }

    console.log("Covid19Story1:data: data: ", this._allRegionData);
    return this;
  }

  protected async table() {
    this._table = (await readJSONFile(TABLE)) as FeatureActionTableRow[];
    console.log("Covid19Story1:table: table: ", this._table);
    return this;
  }

  names(): string[] {
    return Object.keys(this._allRegionData).sort();
  }

  name(name: string): this {
    this._name = name;
    return this;
  }

  selector(id: string) {
    this._svg = d3
      .select(id)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 500)
      .node();

    console.log("Covid19Story1:selector: _svg = ", this._svg);

    return this;
  }

  public build() {
    this._data = this._allRegionData[this._name];

    if (!this._name) return;

    // this.nts = nts(this.data, "Cases/day", WINDOW);
    // this.cts = cts();
    // console.log("execute: ranked nts = ", this.nts);
    // console.log("execute: ranked cts = ", this.cts);

    const actions: DateActionArray = new FeatureActionBuilder()
      .properties({
        metric: "Cases/day",
        window: WINDOW,
      })
      .table(this._table)
      .data(this._data)
      .build();

    console.log("Covid19Story1: actions = ", actions);

    const plot = new LinePlot()
      .data([this._data])
      .name(this._name)
      .properties({})
      .lineProperties()
      .svg(this._svg)
      .actions(actions)
      .draw();

    return this;
  }
}
