import * as d3 from "d3";
import { AbstractStoryBuilder } from "./AbstractStoryBuilder";
import { readCSVFile } from "../../../services/data";
import { ParallelCoordinatePlot } from "../../../components/storyboards/plots/ParallelCoordinatePlot";
import { DateActionsMap } from "../feature-action-builder/FeatureActionMaps";
import { multiVariateStory } from "../../../mocks/feature-action-table-ml";
import { FeatureSearchProperties } from "../feature/FeatureSearch";
import { FeatureActionTableTranslator } from "../feature-action-builder/FeatureActionTableTranslator";
import { ML_TimeseriesDataType } from "../feature-action-builder/TimeseriesDataType";

const FILE = "/static/storyboards/ml/data.csv";

const KEYS = ["channels", "kernel_size", "layers", "samples_per_class"];

export class ML_Story1Builder extends AbstractStoryBuilder {
  protected _data: ML_TimeseriesDataType[] = [];
  protected _key: string;

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

  keys(): string[] {
    return KEYS;
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

  public build(key: string) {
    this._key = key;
    // prettier-ignore
    console.log("create: key = ", key);

    // Sort data by selected key, e.g, "kernel_size"
    let data = this._data
      .slice()
      .sort((a, b) => d3.ascending(a[key], b[key]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));

    // console.log("After sorting, data = ", data);
    // // prettier-ignore
    // console.log("globalMin = ", globalMin, ", globalMax = ", globalMax);

    const dataActionsMap: DateActionsMap = new FeatureActionTableTranslator()
      .properties({ metric: "accuracy" })
      .table(multiVariateStory)
      .data(this._data)
      .translate();

    console.log("dataActionsMap = ", dataActionsMap);

    let plot = new ParallelCoordinatePlot()
      .svg(this._svg)
      .data(data, key)
      .draw();

    return this;
  }

  //
  //
  //
}
