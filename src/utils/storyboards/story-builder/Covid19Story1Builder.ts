import * as d3 from "d3";
import {
  covid19Data1,
  covid19NumericalTable1,
  readJSON,
} from "../../../services/data";
import { TimeseriesData } from "../data-processing/TimeseriesData";
import { FeatureActionBuilder } from "../feature-action-builder/FeatureActionBuilder";
import { LinePlot } from "../../../components/storyboards/plots/LinePlot";
import { StoryBuilder } from "./StoryBuilder";
import { DateActionArray } from "../feature-action-builder/FeatureActionTypes";
import { FeatureActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import { cts, gmm, nts } from "../data-processing/gaussian";

const WINDOW = 3;
const METRIC = "Cases/day";

export class Covid19Story1Builder extends StoryBuilder {
  constructor() {
    super();
  }

  public setData(data: TimeseriesData[]) {
    this.data = data;
    return this;
  }

  public setTableNFA(table: FeatureActionTableRow[]) {
    this.table = table;
    return this;
  }

  public setName(name: string): this {
    this.name = name;
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    console.log("Covid19Story1Builder:selector: _svg = ", this.svg);
    return this;
  }

  public build() {
    if (!this.name) {
      console.error("Covid19Story1Builder:build: name is undefined!");
      return this;
    }
    console.log("Covid19Story1Builder:build: data:", this.data);
    console.log("Covid19Story1Builder:build: table:", this.table);

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

    console.log("Covid19Story1Builder:build: actions = ", actions);

    const plot = new LinePlot()
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
