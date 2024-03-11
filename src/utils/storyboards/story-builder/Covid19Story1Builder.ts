import * as d3 from "d3";
import { readCSVFile } from "../../../services/data";
import { NumericalFeature } from "../feature/NumericalFeature";
import { CategoricalFeature } from "../feature/CategoricalFeature";
import { TimeseriesDataType } from "../data-processing/TimeseriesDataType";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { findIndexOfDate, findIndicesOfDates } from "../../common";
import { DateActionMapType } from "../feature-action-builder/FeatureActionMapsType";
import { featureActionTableStory1 } from "../../../mocks/feature-action-table-covid19";
import { LinePlot } from "../../../components/storyboards/plots/LinePlot";
import { AbstractAction } from "../../../components/storyboards/actions/AbstractAction";
import { AbstractStoryBuilder } from "./AbstractStoryBuilder";

const WINDOW = 3;

export class Covid19Story1Builder extends AbstractStoryBuilder {
  protected _allRegionData: Record<string, TimeseriesDataType[]> = {};
  protected _data: TimeseriesDataType[];
  protected _name: string;

  private _nts: NumericalFeature[];
  private _cts: CategoricalFeature[];

  constructor() {
    super();
  }

  protected async data() {
    const file = "/static/storyboards/newCasesByPublishDateRollingSum.csv";
    const csv: any[] = await readCSVFile(file);
    // console.log("Covid19Story1Builder:load: file = ", file, ", csv = ", csv);

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
        (d1: TimeseriesDataType, d2: TimeseriesDataType) =>
          d1.date.getTime() - d2.date.getTime()
      );
    }

    console.log("Covid19Story1Builder:load: data = ", this._allRegionData);
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

    console.log("Covid19Story1Builder:selector: _svg = ", this._svg);

    return this;
  }

  public build() {
    this._data = this._allRegionData[this._name];

    if (!this._name) return;

    // this.nts = nts(this.data, "Cases/day", WINDOW);
    // this.cts = cts();
    // console.log("execute: ranked nts = ", this.nts);
    // console.log("execute: ranked cts = ", this.cts);

    const dataActionMap: DateActionMapType = new FeatureActionBuilder()
      .properties({
        metric: "Cases/day",
        window: WINDOW,
      })
      .table(featureActionTableStory1)
      .data(this._data)
      .build();

    // console.log("Covid19Story1Builder: dateFeatureMap = ", dateFeatureMap);
    // console.log("Covid19Story1Builder: featureActionMap = ", featureActionMap);
    console.log("Covid19Story1Builder: dataActionsMap = ", dataActionMap);

    const dates: Date[] = [...dataActionMap.keys()];
    dates.sort((d1: Date, d2: Date) => d1.getTime() - d2.getTime());

    const indices = findIndicesOfDates(this._data, dates);
    // prettier-ignore
    console.log("Covid19Story1Builder: dates = ", dates,  ", indices = ", indices);

    const plot = new LinePlot()
      .data([this._data])
      .properties({})
      .lineProperties()
      .svg(this._svg);

    // static
    // plot.draw();

    let start = 0;

    (async () => {
      try {
        for (const date of dates) {
          // prettier-ignore
          console.log("Covid19Story1Builder: index = ", findIndexOfDate(this._data, date));

          const action: AbstractAction = dataActionMap.get(date);
          console.log("Covid19Story1Builder: action = ", action);

          const end = findIndexOfDate(this._data, date);
          await plot.animate(0, start, end);

          action
            .svg(this._svg)
            .draw()
            .coordinate(...plot.coordinates(0, date));

          let response = await action.show();
          console.log("Covid19Story1Builder:  show returns = ", response);
          response = await action.hide();
          console.log("Covid19Story1Builder: hide returns = ", response);

          start = end;
        }

        // plot remaining indices
        if (start < this._data.length) {
          const res = await plot.animate(0, start, this._data.length);
          console.log("res = ", res);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    })();

    return this;
  }
}
