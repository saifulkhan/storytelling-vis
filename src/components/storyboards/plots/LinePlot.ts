import * as d3 from "d3";

import { Plot, PlotProperties } from "./Plot";
import { Action, Coordinate } from "../actions/Action";
import { TimeseriesData } from "../../../utils/storyboards/data-processing/TimeseriesData";
import {
  findDateIdx,
  findIndexOfDate,
} from "../../../utils/storyboards/data-processing/common";
import { DateActionArray } from "../../../utils/storyboards/feature-action-builder/FeatureActionTypes";
import { HorizontalAlign } from "../../../types/Align";

const MARGIN = { top: 50, right: 40, bottom: 50, left: 60 };
const ID_AXIS_SELECTION = "#id-axes-selection",
  YAXIS_LABEL_OFFSET = 12,
  MAGIC_NO = 10,
  TITLE_FONT_SIZE = "14px",
  LINE_STROKE_WIDTH = 1,
  LINE_STROKE = "#2a363b",
  DOT_SIZE = 2;
const FONT_FAMILY = "Arial Narrow";
const FONT_SIZE = "12px";

export type LineProperties = {
  stroke: string;
  strokeWidth?: number;
  showPoints?: boolean;
  onRightAxis?: boolean /* This is ... */;
};

export class LinePlot extends Plot {
  _data: TimeseriesData[][];
  _lineProperties: LineProperties[] = [];
  _plotProperties: PlotProperties;

  svg: SVGSVGElement;
  _selector;
  _width: number;
  _height: number;
  _margin: { top: number; right: number; bottom: number; left: number } =
    MARGIN;

  _xAxis: unknown;
  _leftAxis: unknown;
  _rightAxis: unknown;

  _lineGenerator1;
  _lineGeneratorN;

  _actions: any;
  _name = "";

  constructor() {
    super();
  }

  public plotProperties(p: PlotProperties) {
    this._plotProperties = {
      ...p,
      title: p.title || "title...",
      ticks: p.ticks || true,
      xLabel: p.xLabel || "x axis label...",
      rightAxisLabel: p.rightAxisLabel || "right axis label...",
      leftAxisLabel: p.leftAxisLabel || "left axis label...",
    };

    return this;
  }

  public lineProperties(p: LineProperties[] = []) {
    if (!this._data) {
      throw new Error("LinePlot: Can not set line properties before data!");
    }

    this._data.forEach((_, i: number) => {
      this._lineProperties.push({
        stroke: p[i]?.stroke || LINE_STROKE,
        strokeWidth: p[i]?.strokeWidth || LINE_STROKE_WIDTH,
        onRightAxis:
          typeof p[i]?.onRightAxis === undefined ? false : p[i]?.onRightAxis,
        showPoints:
          typeof p[i]?.showPoints === undefined ? false : p[i]?.showPoints,
      });
    });

    console.log("LinePlot: _lineProperties = ", this._lineProperties);

    return this;
  }

  public setData(data: TimeseriesData[][]) {
    this._data = data;
    console.log("LinePlot: data = ", this._data);
    return this;
  }

  public setName(name: string) {
    this._name = name;
    return this;
  }

  public setSvg(svg: SVGSVGElement) {
    this.svg = svg;
    // clean
    d3.select(this.svg).selectAll("*").remove();
    const bounds = svg.getBoundingClientRect();
    this._height = bounds.height;
    this._width = bounds.width;
    console.log("LinePlot:svg: bounds: ", bounds);

    this._selector = d3
      .select(this.svg)
      .append("g")
      .attr("id", ID_AXIS_SELECTION);

    this.drawAxis();

    return this;
  }

  /**
   ** Draw all lines (no animation)
   **/
  public _draw() {
    console.log("LinePlot:_draw: _data: ", this._data);
    const line = (xAxis, yAxis) => {
      return d3
        .line()
        .x((d: TimeseriesData) => {
          return xAxis(d.date);
        })
        .y((d: TimeseriesData) => {
          if (typeof d.y !== "number" || Number.isNaN(d.y)) {
            console.log(d);
            d.y = 0;
          }
          return yAxis(d.y);
        });
    };

    // draw line and dots
    this._data?.forEach((data: TimeseriesData[], i: number) => {
      const p = this._lineProperties[i];
      const yAxis = this.leftOrRightAxis(i);

      console.log("LinePlot:_draw: data:", data);
      // draw line
      this._selector
        .append("path")
        .attr("stroke", p.stroke)
        .attr("stroke-width", p.strokeWidth)
        .attr("fill", "none")
        .attr("d", line(this._xAxis, yAxis)(data));

      if (p.showPoints) {
        // draw dots
        this._selector
          .append("g")
          .selectAll("circle")
          .data(data.map(Object.values))
          .join("circle")
          .attr("r", DOT_SIZE)
          .attr("cx", (d) => this._xAxis(d[0]))
          .attr("cy", (d) => yAxis(d[1]))
          .style("fill", p.stroke)
          .attr("opacity", 0.5);
      }
    });

    return this;
  }

  /**
   ** Animate & draw a line
   **/

  public setActions(actions: DateActionArray = []) {
    this._actions = actions?.sort((a, b) => a[0].getTime() - b[0].getTime());
    return this;
  }

  public draw() {
    if (!this._actions || !this._actions.length) {
      // draw static
      this._draw();
      return this;
    }

    this.animate(0);
    return this;
  }

  private animate(lineIndex: number = 0) {
    let start = 0;

    (async () => {
      for (let [date, action] of this._actions) {
        const idx = findIndexOfDate(this._data[lineIndex], date);
        console.log("action = ", action);
        // update actions coord, text etc.
        action
          .svg(this.svg)
          .extraProperties({
            align: this.alignLeftOrRight(date),
            date: date.toLocaleDateString(),
            name: this._name,
            value: this._data[lineIndex][idx].y,
          })
          .draw()
          .coordinate(...this.getCoordinates(date.lineIndex));

        const end = idx;
        await this._animate(start, end, lineIndex);
        await action.show();
        await action.hide();
        start = end;
      }
    })();
  }

  private _animate(start: number, stop: number, lineIndex: number = 0) {
    // prettier-ignore
    // console.log(`LinePlot: lineIndex = ${lineIndex}, start = ${start}, stop = ${stop}`)
    // console.log(this._data, this._data[lineIndex]);

    const data = this._data[lineIndex].slice(start, stop + 1);
    const p = this._lineProperties[lineIndex];
    const yAxis = this.leftOrRightAxis(lineIndex);

    const line = (xAxis, yAxis) => {
      return d3
        .line()
        .x((d: TimeseriesData) => xAxis(d.date))
        .y((d: TimeseriesData) => yAxis(d.y));
    };

    // create a path with the data
    const path = this._selector
      .append("path")
      .attr("stroke", p.stroke)
      .attr("stroke-width", p.strokeWidth)
      .attr("fill", "none")
      .attr("d", line(this._xAxis, yAxis)(data));

    const length = path.node().getTotalLength();
    const duration = 1000 || length * 4;

    // Hide the path initially
    path
      .attr("stroke-dasharray", `${length} ${length}`)
      .attr("stroke-dashoffset", length);

    const delay = 1000;

    // Animate current path with duration given by user
    return new Promise<number>((resolve, reject) => {
      path
        .transition()
        .ease(d3.easeLinear)
        .delay(1000)
        .duration(duration)
        .attr("stroke-dashoffset", 0)
        .on("end", () => {
          resolve(delay + duration);
        });
    });
  }

  /**
   ** Draw axes and labels
   **/
  private drawAxis() {
    // clear existing axes and labels
    d3.select(this.svg).selectAll(ID_AXIS_SELECTION).remove();

    // combine the data to create a plot with left and right axes
    let dataOnLeft: TimeseriesData[] = [];
    let dataOnRight: TimeseriesData[] = [];

    this._data.forEach((d: TimeseriesData[], i: number) => {
      if (this._lineProperties[i].onRightAxis) {
        dataOnRight = dataOnRight.concat(d);
      } else {
        dataOnLeft = dataOnLeft.concat(d);
      }
    });

    console.log("LinePlot: dataOnLeft = ", dataOnLeft);
    console.log("LinePlot: dataOnRight = ", dataOnRight);

    this._xAxis = this.xScale(
      dataOnLeft.concat(dataOnRight),
      this._width,
      this._margin
    );
    this._leftAxis = this.yScale(dataOnLeft, this._height, this._margin);
    this._rightAxis = this.yScale(dataOnRight, this._height, this._margin);

    // draw x axis on bottom
    this._selector
      .append("g")
      .attr("transform", `translate(0, ${this._height - this._margin.bottom})`)
      .call(d3.axisBottom(this._xAxis).ticks());

    // draw x axis label on bottom
    this._selector
      .append("text")
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("x", this._width / 2)
      .attr("y", this._height - 5)
      .text(`${this._plotProperties.xLabel}→`);

    // draw left axis and label
    if (dataOnLeft.length) {
      this._selector
        .append("g")
        .attr("transform", `translate(${this._margin.left}, 0)`)
        .call(
          d3.axisLeft(this._leftAxis)
          // .tickFormat((d) => {
          //   let prefix = d3.formatPrefix(".00", d);
          //   return prefix(d);
          // })
        );

      this._selector
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("x", -this._height / 2)
        .attr("y", YAXIS_LABEL_OFFSET)
        .text(`${this._plotProperties.leftAxisLabel}→`);
    }

    // draw right axis and label
    if (dataOnRight.length) {
      this._selector
        .append("g")
        .attr("transform", `translate(${this._width - this._margin.right},0)`)
        .call(
          d3.axisRight(this._rightAxis)
          // .tickFormat((d) => {
          //   let prefix = d3.formatPrefix(".0", d);
          //   return prefix(d);
          // })
        );

      this._selector
        .append("text")
        .attr("transform", "rotate(90)")
        .attr("x", this._height / 2)
        .attr("y", -this._width + YAXIS_LABEL_OFFSET)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(`←${this._plotProperties.rightAxisLabel}`);
    }

    // draw plot title
    this._selector
      .append("text")
      .attr("fill", "currentColor")
      .style("fill", "#696969")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .style("font-size", TITLE_FONT_SIZE)
      .attr("x", this._width / 2)
      .attr("y", this._margin.top + MAGIC_NO)
      .text(this._plotProperties.title);

    return this;
  }

  /**
   ** Create x and y scales
   **/
  private xScale(data: TimeseriesData[], w, m) {
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d: TimeseriesData) => d.date))
      .nice()
      .range([m.left, w - m.right]);
    return xScale;
  }

  private yScale(data: TimeseriesData[], h, m) {
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: TimeseriesData) => d.y)])
      .nice()
      .range([h - m.bottom, m.top]);
    return yScale;
  }

  /*
   * Given a date of the LinePlot, return the corresponding [x1, y1], [x2, y2]
   * coordinates
   */
  public getCoordinates(
    date: Date,
    lineIndex: number = 0
  ): [Coordinate, Coordinate] {
    const data = this._data[lineIndex];
    const index = findDateIdx(date, data);
    const yAxis = this.leftOrRightAxis(lineIndex);

    return [
      [this._xAxis(data[index].date), yAxis(0)],
      [this._xAxis(data[index].date), yAxis(data[index].y)],
    ];
  }

  private leftOrRightAxis(lineIndex: number) {
    const properties = this._lineProperties[lineIndex];
    return properties.onRightAxis ? this._rightAxis : this._leftAxis;
  }

  private alignLeftOrRight(date: Date): HorizontalAlign {
    const x = this._xAxis(date);
    const xMid = (this._xAxis.range()[0] + this._xAxis.range()[1]) / 2;
    return x >= xMid ? "left" : "right";
  }
}
