/**
 ** Implements machine learning multivariate story (MLMV) workflow
 **/

import * as d3 from "d3";
import { Workflow } from "./Workflow";
import { ParallelCoordinatePlot } from "../../../components/storyboards/plots/ParallelCoordinatePlot";
import { FeatureActionCreator } from "../feature-action-create/FeatureActionCreator";
import { MLTimeseriesData } from "../data-processing/TimeseriesData";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import { DateActionArray } from "../feature-action-create/FeatureActionTypes";
import { fromMLToTimeSeriesData } from "../data-processing/common";

const WINDOW = 3;
const METRIC = "accuracy";

export class MLMVWorkflow extends Workflow {
  constructor() {
    super();
  }

  public setData(data: MLTimeseriesData[]) {
    // sort data by selected key, e.g, "kernel_size"
    this.data = data
      .slice()
      .sort((a, b) => d3.ascending(a[this.name], b[this.name]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));
    return this;
  }

  public setNFATable(table: FeatureActionTableRow[]) {
    this.table = table;
    return this;
  }

  public setCFATable(table: any[]): this {
    throw new Error("Method not implemented.");
  }

  public setName(name: string): this {
    this.name = name;
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    return this;
  }

  public create() {
    // FeatureActionBuilder takes TimeseriesData, so we need to transform it
    const data = fromMLToTimeSeriesData(this.data, this.name);

    const actions: DateActionArray = new FeatureActionCreator()
      .setProps({ metric: METRIC, window: WINDOW })
      .setData(data)
      .setTable(this.table)
      .create();

    console.log("MLMVWorkflow:setup: actions: ", actions);

    new ParallelCoordinatePlot()
      .setPlotProps({ margin: { top: 150, right: 50, bottom: 60, left: 60 } })
      .setName(this.name)
      .setData(this.data)
      .setCanvas(this.svg)
      .setActions(actions)
      // .plot();
      .animate();

    return this;
  }
}
