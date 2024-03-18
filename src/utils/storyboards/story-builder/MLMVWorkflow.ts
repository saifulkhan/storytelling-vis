/**
 ** Implements machine learning multivariate story workflow
 **/

import * as d3 from "d3";
import { Workflow } from "./Workflow";
import { readCSV } from "../../../services/data";
import { ParallelCoordinatePlot } from "../../../components/storyboards/plots/ParallelCoordinatePlot";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { MLTimeseriesData } from "../data-processing/TimeseriesData";

const FILE = "/static/storyboards/ml/data.csv";
const NAMES = ["channels", "kernel_size", "layers", "samples_per_class"];

export class MLMVWorkflow extends Workflow {
  protected data: MLTimeseriesData[] = [];
  protected name = "";

  constructor() {
    super();
  }

  protected async setData() {
    const csv: any[] = await readCSV(FILE);
    // prettier-ignore
    // console.log("MLMVWorkflow:load: FILE = ", FILE, ", csv = ", csv);

    // convert string to number and date
    csv.forEach((row) => {
      this.data.push({
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
    console.log("MLMVWorkflow: loadData: _data = ", this.data);
  }

  getNames(): string[] {
    return NAMES;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  public setCanvas(id: string) {
    this.svg = d3
      .select(id)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 600)
      .node();

    console.log("MLMVWorkflow:selector: _svg = ", this.svg);
    return this;
  }

  public build() {
    // sort data by selected key, e.g, "kernel_size"
    let data = this.data
      .slice()
      .sort((a, b) => d3.ascending(a[this.name], b[this.name]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));

    // console.log("After sorting, data = ", data);
    // prettier-ignore
    // console.log("globalMin = ", globalMin, ", globalMax = ", globalMax);

    const actions: DateActionArray = new FeatureActionBuilder()
      .setProps({ metric: "accuracy" })
      .setTable(ML_STORY_1)
      .setData(this.data)
      .setName(this.name)
      .build();

    console.log("MLMVWorkflow: actions = ", actions);

    let plot = new ParallelCoordinatePlot()
      .name(this.name)
      .setData(data)
      .setCanvas(this.svg)
      .actions(actions)
      .draw();

    return this;
  }
}
