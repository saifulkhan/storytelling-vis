/**
 ** Implements machine learning multivariate story (MLMV) workflow
 **/

import * as d3 from "d3";
import { Workflow } from "./Workflow";
import { ParallelCoordinatePlot } from "../../../components/storyboards/plots/ParallelCoordinatePlot";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { MLTimeseriesData } from "../data-processing/TimeseriesData";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import { DateActionArray } from "../feature-action-builder/FeatureActionTypes";

const WINDOW = 3;
const METRIC = "accuracy";

export class MLMVWorkflow extends Workflow {
  protected data: MLTimeseriesData[] = [];
  protected name = "";

  constructor() {
    super();
  }

  private setData(data: MLTimeseriesData[]) {
    this.data = data;
    return this;
  }

  public setNFATable(table: FeatureActionTableRow[]) {
    this.table = table;
    return this;
  }

  public setName(name: string): this {
    this.name = name;
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    console.log("MLMVWorkflow:setCanvas: svg = ", this.svg);
    return this;
  }

  public setup() {
    // sort data by selected key, e.g, "kernel_size"
    let data = this.data
      .slice()
      .sort((a, b) => d3.ascending(a[this.name], b[this.name]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));

    // const actions: DateActionArray = new FeatureActionBuilder()
    //   .setProps({ metric: METRIC, window: WINDOW })
    //   .setData(this.data)
    //   .setTable(this.table)
    //   .build();

    // console.log("MLMVWorkflow:setup: actions: ", actions);

    new ParallelCoordinatePlot()
      .name(this.name)
      .setData(data)
      .setCanvas(this.svg)
      // .actions(actions)
      .draw();

    return this;
  }
}
