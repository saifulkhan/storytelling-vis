import * as d3 from "d3";

import { AbstractPlot } from "./AbstractPlot";
import { Coordinate } from "../actions/AbstractAction";
import { TimeseriesDataType } from "../../../utils/storyboards/data-processing/TimeseriesDataType";
import { findDateIdx } from "../../../utils/common";

const MARGIN = { top: 50, right: 50, bottom: 50, left: 50 };
const ID_AXIS_SELECTION = "#id-axes-selection",
  YAXIS_LABEL_OFFSET = 10,
  MAGIC_NO = 10,
  TITLE_FONT_SIZE = "14px",
  LINE_STROKE_WIDTH = 2,
  LINE_STROKE = "#2a363b";

// TODO: Should we merge these properties?
// TODO: What would be a good name that applies to all plots?

export type LinePlotProperties = {
  title?: string;
  ticks?: boolean;
  xLabel?: string;
  rightAxisLabel?: string;
  leftAxisLabel?: string;
};

export type LineProperties = {
  stroke: string;
  strokeWidth?: number;
  showPoints?: boolean;
  onRightAxis?: boolean /* This is ... */;
};

export class LinePlot extends AbstractPlot {
  _data: TimeseriesDataType[][];
  _lineProperties: LineProperties[] = [];
  _linePlotProperties: LinePlotProperties;

  _svg: SVGSVGElement;
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

  constructor() {
    super();
  }

  public properties(p: LinePlotProperties) {
    this._linePlotProperties = {
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

  public data(data: TimeseriesDataType[][]) {
    this._data = data;
    console.log("LinePlot: data = ", this._data);
    return this;
  }

  public svg(svg: SVGSVGElement) {
    this._svg = svg;
    const bounds = svg.getBoundingClientRect();
    this._height = bounds.height;
    this._width = bounds.width;
    console.log("LinePlot: bounds = ", bounds);

    this._selector = d3
      .select(this._svg)
      .append("g")
      .attr("id", ID_AXIS_SELECTION);

    this.drawAxis();

    return this;
  }

  /**
   ** Draw all lines (no animation)
   **/
  public _draw() {
    const lineGenerator = (xAxis, yAxis) => {
      return d3
        .line()
        .x((d: TimeseriesDataType) => xAxis(d.date))
        .y((d: TimeseriesDataType) => yAxis(d.y));
    };

    // draw line and dots
    this._data?.forEach((data: TimeseriesDataType[], i: number) => {
      const p = this._lineProperties[i];
      const yAxis = this.leftOrRightAxis(i);

      // draw line
      this._selector
        .append("path")
        .attr("stroke", p.stroke)
        .attr("stroke-width", p.strokeWidth)
        .attr("fill", "none")
        .attr("d", lineGenerator(this._xAxis, yAxis)(data));

      if (p.showPoints) {
        // draw dots
        this._selector
          .append("g")
          .selectAll("circle")
          .data(data.map(Object.values))
          .join("circle")
          .attr("r", 4)
          .attr("cx", (d) => this._xAxis(d[0]))
          .attr("cy", (d) => yAxis(d[1]))
          .style("fill", p.stroke)
          .attr("opacity", 0.2);
      }
    });

    return this;
  }

  /**
   ** Animate & draw a line
   **/

  public actions(actions: DateActionArray) {
    this._actions = actions?.sort((a, b) => a[0].getTime() - b[0].getTime());

    // update actions coord, text etc.
    return this;
  }

  public draw(lineNo: number, start: number, stop: number) {
    // prettier-ignore
    // console.log(`LinePlot: lineNo = ${lineNo}, start = ${start}, stop = ${stop}`)
    // console.log(this._data, this._data[lineNo]);

    const data = this._data[lineNo].slice(start, stop + 1);
    const p = this._lineProperties[lineNo];
    const yAxis = this.leftOrRightAxis(lineNo);

    const lineGenerator = (xAxis, yAxis) => {
      return d3
        .line()
        .x((d: TimeseriesDataType) => xAxis(d.date))
        .y((d: TimeseriesDataType) => yAxis(d.y));
    };

    // create a path with the data
    const path = this._selector
      .append("path")
      .attr("stroke", p.stroke)
      .attr("stroke-width", p.strokeWidth)
      .attr("fill", "none")
      .attr("d", lineGenerator(this._xAxis, yAxis)(data));

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
    d3.select(this._svg).selectAll(ID_AXIS_SELECTION).remove();

    // combine the data to create a plot with left and right axes
    let dataOnLeft: TimeseriesDataType[] = [];
    let dataOnRight: TimeseriesDataType[] = [];

    this._data.forEach((d: TimeseriesDataType[], i: number) => {
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
      .text(`${this._linePlotProperties.xLabel}→`);

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
        .text(`${this._linePlotProperties.leftAxisLabel}→`);
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
        .text(`←${this._linePlotProperties.rightAxisLabel}`);
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
      .text(this._linePlotProperties.title);

    return this;
  }

  /**
   ** Create x and y scales
   **/
  private xScale(data: TimeseriesDataType[], w, m) {
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d: TimeseriesDataType) => d.date))
      .nice()
      .range([m.left, w - m.right]);
    return xScale;
  }

  private yScale(data: TimeseriesDataType[], h, m) {
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: TimeseriesDataType) => d.y)])
      .nice()
      .range([h - m.bottom, m.top]);
    return yScale;
  }

  private leftOrRightAxis(lineNo: number) {
    const p = this._lineProperties[lineNo];
    return p.onRightAxis ? this._rightAxis : this._leftAxis;
  }

  /*
   * Given a date of the LinePlot, return the corresponding [x, y, x0, y0]
   * coordinates
   */
  public coordinates(lineNo: number, date: Date): [Coordinate, Coordinate] {
    const data = this._data[lineNo];
    const d = data[findDateIdx(date, data)];
    const yAxis = this.leftOrRightAxis(lineNo);

    return [
      [this._xAxis(d.date), yAxis(0)],
      [this._xAxis(d.date), yAxis(d.y)],
    ];
  }
}
