import * as d3 from "d3";
import { Plot, PlotProps, defaultPlotProps } from "./Plot";
import { Action, Coordinate } from "../actions/Action";
import { TimeseriesData } from "../../../utils/storyboards/data-processing/TimeseriesData";
import {
  findDateIdx,
  findIndexOfDate,
} from "../../../utils/storyboards/common";
import { DateActionArray } from "../../../utils/storyboards/feature-action-create/FeatureActionTypes";
import { HorizontalAlign, VerticalAlign } from "../../../types/Align";

const ID_AXIS_SELECTION = "#id-axes-selection",
  MAGIC_NO = 10,
  LINE_STROKE_WIDTH = 1,
  LINE_STROKE = "#2a363b",
  DOT_SIZE = 2,
  TITLE_FONT_FAMILY = "Arial Narrow",
  TITLE_FONT_SIZE = "14px",
  AXIS_FONT_FAMILY = "Arial Narrow",
  AXIS_FONT_SIZE = "12px",
  YAXIS_LABEL_OFFSET = 12;

export type LineProps = {
  stroke: string;
  strokeWidth?: number;
  showPoints?: boolean;
  onRightAxis?: boolean /* This is ... */;
};

export class LinePlot extends Plot {
  data: TimeseriesData[][];
  lineProps: LineProps[] = [];
  plotProps: PlotProps;

  svg: SVGSVGElement;
  selector;
  width: number;
  height: number;
  margin: any;

  xAxis: unknown;
  leftAxis: unknown;
  rightAxis: unknown;

  actions: any;
  name = "";

  constructor() {
    super();
  }

  public setPlotProps(props: PlotProps) {
    this.plotProps = { ...defaultPlotProps, ...props };
    return this;
  }

  public setLineProps(p: LineProps[] = []) {
    if (!this.data) {
      throw new Error("LinePlot: Can not set line properties before data!");
    }

    this.data.forEach((_, i: number) => {
      this.lineProps.push({
        stroke: p[i]?.stroke || LINE_STROKE,
        strokeWidth: p[i]?.strokeWidth || LINE_STROKE_WIDTH,
        onRightAxis:
          typeof p[i]?.onRightAxis === undefined ? false : p[i]?.onRightAxis,
        showPoints:
          typeof p[i]?.showPoints === undefined ? false : p[i]?.showPoints,
      });
    });

    console.log("LinePlot: lineProps = ", this.lineProps);

    return this;
  }

  public setData(data: TimeseriesData[][]) {
    this.data = data;
    console.log("LinePlot: data = ", this.data);
    return this;
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setCanvas(svg: SVGSVGElement) {
    this.svg = svg;
    this.clean();

    const bounds = svg.getBoundingClientRect();
    this.height = bounds.height;
    this.width = bounds.width;
    this.margin = this.plotProps.margin;

    console.log("LinePlot:setCanvas: bounds: ", bounds);

    this.selector = d3
      .select(this.svg)
      .append("g")
      .attr("id", ID_AXIS_SELECTION);

    this.drawAxis();

    return this;
  }

  /**
   ** Draw all lines (no animation)
   **/
  public plot() {
    console.log("LinePlot:_draw: _data: ", this.data);
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
    this.data?.forEach((dataX: TimeseriesData[], i: number) => {
      const p = this.lineProps[i];
      const yAxis = this.leftOrRightAxis(i);

      console.log("LinePlot:_draw: data:", dataX);
      // draw line
      this.selector
        .append("path")
        .attr("stroke", p.stroke)
        .attr("stroke-width", p.strokeWidth)
        .attr("fill", "none")
        .attr("d", line(this.xAxis, yAxis)(dataX));

      if (p.showPoints) {
        // draw dots
        this.selector
          .append("g")
          .selectAll("circle")
          .data(dataX.map(Object.values))
          .join("circle")
          .attr("r", DOT_SIZE)
          .attr("cx", (d) => this.xAxis(d[0]))
          .attr("cy", (d) => yAxis(d[1]))
          .style("fill", p.stroke)
          .attr("opacity", 0.5);
      }
    });

    return this;
  }

  /**
   ** Set the list of actions to be animated
   **/
  public setActions(actions: DateActionArray = []) {
    this.actions = actions?.sort((a, b) => a[0].getTime() - b[0].getTime());
    return this;
  }

  public animate(lineIndex: number = 0) {
    // TODO: if no actions
    // if (!this._actions || !this._actions.length) {
    //   // draw static
    //   this._draw();
    //   return this;
    // }

    let start = 0;
    const dataX = this.data[lineIndex];

    (async () => {
      for (let [date, action] of this.actions) {
        const idx = findIndexOfDate(dataX, date);
        console.log("LinePlot:animate: action = ", action);
        // update actions coord, text etc.
        action
          .updateProps({
            date: date.toLocaleDateString(),
            name: this.name,
            value: dataX[idx].y,
            horizontalAlign: this.getHorizontalAlign(date),
            verticalAlign: "top" as VerticalAlign,
          })
          .setCanvas(this.svg)
          .setCoordinate(this.getCoordinates(date, lineIndex));

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

    const dataX = this.data[lineIndex].slice(start, stop + 1);
    const p = this.lineProps[lineIndex];
    const yAxis = this.leftOrRightAxis(lineIndex);

    const line = (xAxis, yAxis) => {
      return d3
        .line()
        .x((d: TimeseriesData) => xAxis(d.date))
        .y((d: TimeseriesData) => yAxis(d.y));
    };

    // create a path with the data
    const path = this.selector
      .append("path")
      .attr("stroke", p.stroke)
      .attr("stroke-width", p.strokeWidth)
      .attr("fill", "none")
      .attr("d", line(this.xAxis, yAxis)(dataX));

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

    this.data.forEach((d: TimeseriesData[], i: number) => {
      if (this.lineProps[i].onRightAxis) {
        dataOnRight = dataOnRight.concat(d);
      } else {
        dataOnLeft = dataOnLeft.concat(d);
      }
    });

    console.log("LinePlot: dataOnLeft = ", dataOnLeft);
    console.log("LinePlot: dataOnRight = ", dataOnRight);

    this.xAxis = this.xScale(
      dataOnLeft.concat(dataOnRight),
      this.width,
      this.margin
    );
    this.leftAxis = this.yScale(dataOnLeft, this.height, this.margin);
    this.rightAxis = this.yScale(dataOnRight, this.height, this.margin);

    // draw x axis on bottom
    this.selector
      .append("g")
      .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.xAxis).ticks());

    // draw x axis label on bottom
    this.selector
      .append("text")
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("x", this.width / 2)
      .attr("y", this.height - 5)
      .style("font-size", AXIS_FONT_SIZE)
      .style("font-family", AXIS_FONT_FAMILY)

      .text(`${this.plotProps.xLabel}→`);

    // draw left axis and label
    if (dataOnLeft.length) {
      this.selector
        .append("g")
        .attr("transform", `translate(${this.margin.left}, 0)`)
        .call(
          d3.axisLeft(this.leftAxis)
          // .tickFormat((d) => {
          //   let prefix = d3.formatPrefix(".00", d);
          //   return prefix(d);
          // })
        );

      this.selector
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("x", -this.height / 2)
        .attr("y", YAXIS_LABEL_OFFSET)
        .style("font-size", AXIS_FONT_SIZE)
        .style("font-family", AXIS_FONT_FAMILY)
        .text(`${this.plotProps.leftAxisLabel}→`);
    }

    // draw right axis and label
    if (dataOnRight.length) {
      this.selector
        .append("g")
        .attr("transform", `translate(${this.width - this.margin.right},0)`)
        .call(
          d3.axisRight(this.rightAxis)
          // .tickFormat((d) => {
          //   let prefix = d3.formatPrefix(".0", d);
          //   return prefix(d);
          // })
        );

      this.selector
        .append("text")
        .attr("transform", "rotate(90)")
        .attr("x", this.height / 2)
        .attr("y", -this.width + YAXIS_LABEL_OFFSET)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .style("font-size", AXIS_FONT_SIZE)
        .style("font-family", AXIS_FONT_FAMILY)
        .text(`←${this.plotProps.rightAxisLabel}`);
    }

    // draw plot title
    this.selector
      .append("text")
      .attr("fill", "currentColor")
      .style("fill", "#696969")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .style("font-size", TITLE_FONT_SIZE)
      .style("font-family", TITLE_FONT_FAMILY)
      .attr("x", this.width / 2)
      .attr("y", this.margin.top + MAGIC_NO)
      .text(this.plotProps.title);

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
    const dataX = this.data[lineIndex];
    const index = findDateIdx(date, dataX);
    const yAxis = this.leftOrRightAxis(lineIndex);

    return [
      [this.xAxis(dataX[index].date), yAxis(0)],
      [this.xAxis(dataX[index].date), yAxis(dataX[index].y)],
    ];
  }

  private leftOrRightAxis(lineIndex: number) {
    const properties = this.lineProps[lineIndex];
    return properties.onRightAxis ? this.rightAxis : this.leftAxis;
  }

  private getHorizontalAlign(date: Date): HorizontalAlign {
    const x = this.xAxis(date);
    const xMid = (this.xAxis.range()[0] + this.xAxis.range()[1]) / 2;
    return x >= xMid ? "left" : "right";
  }
}
