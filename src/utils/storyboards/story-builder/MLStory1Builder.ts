import * as d3 from "d3";
import { AbstractStoryBuilder } from "./AbstractStoryBuilder";
import { readCSVFile } from "../../../services/data";
import { ParallelCoordinatePlot } from "../../../components/storyboards/plots/ParallelCoordinatePlot";
import { DateActionsMapType } from "../feature-action-builder/FeatureActionMapsType";
import { multiVariateStory } from "../../../mocks/feature-action-table-ml";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { MLTimeseriesDataType } from "../data-processing/MLTimeseriesDataType";

const FILE = "/static/storyboards/ml/data.csv";
const NAMES = ["channels", "kernel_size", "layers", "samples_per_class"];

export class MLStory1Builder extends AbstractStoryBuilder {
  protected _data: MLTimeseriesDataType[] = [];
  protected _name = "";

  constructor() {
    super();
  }

  protected async data() {
    const csv: any[] = await readCSVFile(FILE);
    // prettier-ignore
    // console.log("MLMultivariateStoryWorkflow:load: FILE = ", FILE, ", csv = ", csv);

    // convert string to number and date
    csv.forEach((row) => {
      this._data.push({
        "date" :new Date(row.date),
        "mean_test_accuracy" : +row.mean_test_accuracy,
        "mean_training_accuracy" : +row.mean_training_accuracy,
        "channels" : +row.channels,
        "kernel_size" : +row.kernel_size,
        "layers" : +row.layers,
        "samples_per_class" : +row.samples_per_class,  
      });
    });

    // prettier-ignore
    console.log("MLMultiVariateStoryWorkflow: loadData: _data = ", this._data);
  }

  names(): string[] {
    return NAMES;
  }

  name(name: string): this {
    this._name = name;
    return this;
  }

  public selector(id: string) {
    this._svg = d3
      .select(id)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 600)
      .node();

    console.log("MLMultiVariateStoryWorkflow:selector: _svg = ", this._svg);
    return this;
  }

  public build() {
    // sort data by selected key, e.g, "kernel_size"
    let data = this._data
      .slice()
      .sort((a, b) => d3.ascending(a[this._name], b[this._name]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));

    // console.log("After sorting, data = ", data);
    // prettier-ignore
    // console.log("globalMin = ", globalMin, ", globalMax = ", globalMax);

    const dataActionsMap: DateActionsMapType = new FeatureActionBuilder()
      .properties({ metric: "accuracy" })
      .table(multiVariateStory)
      .data(this._data)
      .name(this._name)
      .build();

    console.log("dataActionsMap = ", dataActionsMap);

    let plot = new ParallelCoordinatePlot()
      .name(this._name)
      .data(data)
      .svg(this._svg)
      .draw();

    return this;
  }
}
