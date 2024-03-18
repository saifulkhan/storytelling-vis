/**
 ** Implements Covid19 single location story workflow
 **/

import { TimeseriesData } from "../data-processing/TimeseriesData";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { LinePlot } from "../../../components/storyboards/plots/LinePlot";
import { Workflow } from "./Workflow";
import { DateActionArray } from "../feature-action-builder/FeatureActionTypes";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import { cts, gmm, nts } from "../data-processing/gaussian";

const WINDOW = 3;
const METRIC = "Cases/day";

export class Covid19SLWorkflow extends Workflow {
  constructor() {
    super();
  }

  public setData(data: TimeseriesData[]) {
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
    console.log("Covid19SLWorkflow:setCanvas: svg = ", this.svg);
    return this;
  }

  public setup() {
    console.log("Covid19SLWorkflow:setup: data:", this.data);
    console.log("Covid19SLWorkflow:setup: table:", this.table);

    // this.nts = gmm(this.data, "Cases/day", WINDOW);
    // this.cts = cts();
    // console.log("execute: ranked nts = ", this.nts);
    // console.log("execute: ranked cts = ", this.cts);

    const actions: DateActionArray = new FeatureActionBuilder()
      .setProps({
        metric: METRIC,
        window: WINDOW,
      })
      .setTable(this.table)
      .setData(this.data)
      .build();

    console.log("Covid19SLWorkflow:setup: actions: ", actions);

    new LinePlot()
      .setData([this.data])
      .setName(this.name)
      .setPlotProps({})
      .setLineProps([])
      .setCanvas(this.svg)
      .setActions(actions)
      .animate();
    // .draw();

    return this;
  }
}
