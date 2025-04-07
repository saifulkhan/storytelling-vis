/**
 ** Implements Covid19 single location story workflow
 **/

import { TimeSeriesPoint } from "../data-processing/TimeseriesPoint";
import { MSBFeatureActionFactory } from "../feature-action/MSBFeatureActionFactory";
import { LinePlot } from "../../../components/storyboards/plots/LinePlot";
import { MSBWorkflow } from "./MSBWorkflow";
import { DateActionArray } from "../feature-action/FeatureActionTypes";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import { cts, gmm, nts } from "../data-processing/Gaussian";

const WINDOW = 3;
const METRIC = "Cases/day";

export class Covid19SLWorkflow extends MSBWorkflow {
  private animationInterval: number | null = null;

  constructor() {
    super();
  }

  public setData(data: TimeSeriesPoint[]) {
    this.data = data as TimeSeriesPoint[];
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

  public setCanvas(svg: SVGSVGElement) {
    this.svg = svg;
    console.log("Covid19SLWorkflow:setCanvas: svg = ", this.svg);
    return this;
  }

  public create() {
    console.log("Covid19SLWorkflow: create: data = ", this.data);
    console.log("Covid19SLWorkflow: create: table = ", this.table);

    // this.nts = gmm(this.data, "Cases/day", WINDOW);
    // this.cts = cts();
    // console.log("execute: ranked nts = ", this.nts);
    // console.log("execute: ranked cts = ", this.cts);

    const actions: DateActionArray = new MSBFeatureActionFactory()
      .setProps({
        metric: METRIC,
        window: WINDOW,
      })
      .setTable(this.table)
      .setData(this.data)
      .create();

    console.log("Covid19SLWorkflow: create: actions = ", actions);

    this.plot = new LinePlot()
      .setData([this.data])
      .setName(this.name)
      .setPlotProps({})
      .setLineProps([])
      .setCanvas(this.svg)
      .setActions(actions);
    // .animate();
    // .plot();

    return this;
  }

  public play() {
    console.log("Covid19SLWorkflow: play");
    if (this.plot) {
      this.plot.play();
    }
  }

  public pause() {
    console.log("Covid19SLWorkflow: pause");
    if (this.plot) {
      this.plot.pause();
    }
  }
}
