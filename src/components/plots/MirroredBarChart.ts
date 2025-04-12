import * as d3 from "d3";
import { TimeSeriesData, TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { Plot, PlotProps, defaultPlotProps } from "./Plot";
import { Colors } from "src/components/Colors";
import { TimelineMSBActions } from "src/types/TimelineMSBActions";

export type MirroredBarChartProps = PlotProps & {
  fontSize?: string;
  yAxisLabelFontSize?: string;
  yAxisLabelOffset?: number;
  lineColor?: string;
  barColor?: string;
  barWidth?: number;
  barXAxisGap?: number;
  xLabel?: string;
  yLabel1?: string;
  yLabel2?: string;
};

const ID_AXIS_SELECTION = "#id-axes-selection";

export class MirroredBarChart extends Plot {
  props: MirroredBarChartProps = {
    ...defaultPlotProps,
    margin: { top: 150, right: 50, bottom: 60, left: 60 },
    fontSize: "12px",
    yAxisLabelFontSize: "14px",
    yAxisLabelOffset: 10,
    lineColor: Colors.DarkGrey,
    barColor: Colors.CornflowerBlue,
    barWidth: 3,
    barXAxisGap: 2,
    xLabel: "x axis",
    yLabel1: "y1 axis",
    yLabel2: "y2 axis",
  };

  data: TimeSeriesData = [];
  name: string = "";
  svg!: SVGSVGElement;
  selector: any;
  width: number = 0;
  height: number = 0;
  margin: any = {};
  xScale: any;
  yScale1: any;
  yScale2: any;

  actions: any = [];
  startDataIdx: number = 0; // index of data for animation
  endDataIdx: number = 0;

  // _barElements = [];

  constructor() {
    super();
  }

  public setProps(props: MirroredBarChartProps) {
    this.props = { ...this.props, ...props };
    return this;
  }

  public setData(data: TimeSeriesData) {
    this.data = data;
    console.log(" dat: ", this.data);
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
    this.margin = this.props.margin;

    console.log("LinePlot:setCanvas: bounds: ", bounds);

    this.selector = d3
      .select(this.svg)
      .append("g")
      .attr("id", ID_AXIS_SELECTION);

    this._drawAxis();

    return this;
  }

  /**
   ** Set the list of actions to be animated
   **/
  public setActions(actions: TimelineMSBActions = []) {
    this.actions = actions?.sort((a, b) => a[0].getTime() - b[0].getTime());
    this.playActionIdx = 0;
    this.lastAction = null;
    this.startDataIdx = 0;
    this.endDataIdx = 0;

    return this;
  }

  /**
   ** Draw bars and lines (no animation)
   **/
  plot() {
    console.log("plot: data:", this.data);
    this._drawAxis();

    d3.select(this.svg)
      .selectAll("bar")
      .data(this.data)
      .join("rect")
      .attr("x", (d) => this.xScale(d.date))
      .attr(
        "y",
        (d) => this.yScale1(d.mean_test_accuracy) - this.props.barXAxisGap
      )
      .attr("width", this.props.barWidth)
      .attr(
        "height",
        (d) => this.yScale1(0) - this.yScale1(d.mean_test_accuracy)
      )
      .attr("fill", this.props.barColor);

    d3.select(this.svg)
      .selectAll("bar")
      .data(this.data)
      .join("rect")
      .attr("x", (d) => this.xScale(d.date))
      .attr(
        "y",
        (d) =>
          (this.height - this.margin.top - this.margin.bottom) / 2 +
          this.props.barXAxisGap
      )
      .attr("width", this.props.barWidth)
      .attr("height", (d) => -this.yScale2(0) + this.yScale2(d.y))
      .attr("fill", this.props.barColor);

    return this.svg;
  }

  /**
   * Create axes and add labels
   **/
  _drawAxis() {
    d3.select(this.svg).selectAll("#id-axes-labels").remove(); // TODO
    console.log("_drawAxis: data = ", this.data);

    this.xScale = d3
      .scaleTime()
      .domain(d3.extent(this.data, (d: TimeSeriesPoint) => d.date))
      .nice()
      .range([this.margin.left, this.width - this.margin.right]);

    this.yScale1 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.data, (d: TimeSeriesData) => d.mean_test_accuracy),
      ])
      .nice()
      .range([
        (this.height - this.margin.top - this.margin.bottom) / 2,
        this.margin.top,
      ]);

    this.yScale2 = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d: TimeSeriesData) => d.y)])
      .nice()
      .range([
        (this.height - this.margin.bottom - this.margin.top) / 2,
        this.height - this.margin.bottom,
      ]);

    const selection = d3
      .select(this.svg)
      .append("g")
      .attr("id", "id-axes-labels");

    // Create the X-axis in middle
    const xAxis = d3.axisBottom(this.xScale);
    // this.ticks && xAxis.ticks(this.ticks);

    selection
      .append("g")
      .attr(
        "transform",
        `translate(0, ${
          (this.height - this.margin.top - this.margin.bottom) / 2
        })`
      )
      .call(xAxis)
      .style("font-size", this.props.fontSize)
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this.width / 2)
      .attr("y", this.height - 5)
      .text(this.props.xLabel);

    // Create the top Y-axis
    const yAxisTop = d3.axisLeft(this.yScale1);
    yAxisTop.ticks(5);
    selection
      .append("g")
      .attr("transform", `translate(${this.margin.left}, 0)`)
      .call(yAxisTop)
      .style("font-size", this.props.fontSize)
      // label
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.height / 4)
      .attr("y", -this.margin.left + this.props.yAxisLabelOffset)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this.props.yLabel1)
      .style("font-size", this.props.yAxisLabelFontSize)
      .style("fill", "black");

    // Create the bottom y-axis
    const yAxisBottom = d3.axisLeft(this.yScale2);
    yAxisBottom.ticks(5).tickFormat((d) => {
      let prefix = d3.formatPrefix(".0", d);
      return prefix(d);
    });

    selection
      .append("g")
      .attr("transform", `translate(${this.margin.left}, 0)`)
      .call(yAxisBottom)
      .style("font-size", this.props.fontSize)
      // label
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.height / 1.5)
      .attr("y", -this.margin.left + this.props.yAxisLabelOffset)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this.props.yLabel2)
      .style("font-size", this.props.yAxisLabelFontSize)
      .style("fill", "black");

    return this;
  }

  /**************************************************************************************************************
   * Setters
   **************************************************************************************************************/

  /**
   * We pass height, width & margin here to keep it consistent with the svg() method.
   */
  // selector(selector, height = HEIGHT, width = WIDTH, margin = MARGIN) {
  //   this._selector = selector;
  //   this._height = height;
  //   this._width = width;
  //   this._margin = margin;

  //   d3.select(this._selector).select("svg").remove();

  //   this._svg = d3
  //     .select(this._selector)
  //     .append("svg")
  //     .attr("width", this._width)
  //     .attr("height", this._height)
  //     // .style("background-color", "pink") // debug
  //     .node();

  //   return this;
  // }

  /**************************************************************************************************************
   * Drawing methods
   **************************************************************************************************************/

  animate(animationType: AnimationType) {
    console.log("MirroredBarChart: animate: animationType = ", animationType);
    //
    // At the beginning create a list of d3 paths and annotations
    //
    if (this._barElements.length === 0) {
      this._createBars();
    }

    if (animationType === "back" && this._animationCounter >= 0) {
      this._animateBack();
      this._animationCounter -= 1;
    } else if (animationType === "beginning") {
      this._animateBeginning();
      this._animationCounter = -1;
    } else if (
      animationType === "play" &&
      this._animationCounter + 1 < this._lpAnnotations.length
    ) {
      this._animateForward();
      this._animationCounter += 1;
    }

    // prettier-ignore
    console.log("TimeSeries1: animate: _animationCounter: ", this._animationCounter)
  }

  /**************************************************************************************************************
   * Private methods
   **************************************************************************************************************/

  // TODO: We don't want to create excessive number of bars
  _createBars() {
    this._barElements = this._lpAnnotations.map((d: TSPAnnotation) => {
      console.log("MirroredBarChart: _createBars: annotation, d = ", d);
      const point = this._data[d.end];

      // Take the first data point of the segment to draw a dot
      const barElement = d3.select(this._svg).append("g").style("opacity", 0);

      barElement
        .append("rect")
        .attr("x", (d) => this._xScale(point.date))
        .attr(
          "y",
          (d) => this._yScale1(point.mean_test_accuracy) - BAR_XAXIS_GAP
        )
        .attr("width", BAR_WIDTH)
        .attr(
          "height",
          (d) => this._yScale1(0) - this._yScale1(point.mean_test_accuracy)
        )
        .attr("fill", this._color1);

      barElement
        .append("rect")
        .attr("x", (d) => this._xScale(point.date))
        .attr(
          "y",
          (d) =>
            (this._height - this._margin.top - this._margin.bottom) / 2 +
            BAR_XAXIS_GAP
        )
        .attr("width", BAR_WIDTH)
        .attr("height", (d) => -this._yScale2(0) + this._yScale2(point.y))
        .attr("fill", this._color2);

      return barElement;
    });

    // prettier-ignore
    console.log("MirroredBarChart: _createBars: _barElements: ", this._barElements);
  }

  /*
   * This will remove the current path
   * Show or hide the path elements to svg based on the animation counter value
   */
  _animateBeginning() {
    console.log(`MirroredBarChart: _animateBeginning`);

    // Disappear all
    this._barElements.forEach((d) => {
      d.style("opacity", 0);
    });

    return;
  }

  /*
   * This will remove the current path
   * Show or hide the path elements to svg based on the animation counter value
   */
  _animateBack() {
    const currentIndex = this._animationCounter;
    // prettier-ignore
    console.log(`MirroredBarChart: _animateBack: ${currentIndex} <- ${currentIndex + 1}`);

    const delay = 500;
    const duration = 500;

    // Hide
    const barElement = this._barElements[currentIndex];
    if (barElement) {
      barElement
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 0);
    }
  }

  /*
   * This will show or hide the path elements to svg based on the animation counter value
   */
  _animateForward() {
    // Number of path segments
    const pathNum = this._lpAnnotations.length;
    // Use modulus to repeat animation sequence once counter > number of animation segments
    const currIdx = this._animationCounter % pathNum;
    const prevIdx = (this._animationCounter - 1) % pathNum;
    // prettier-ignore
    console.log(`MirroredBarChart: _animateForward: prevIdx = ${prevIdx}, currIdx = ${currIdx}`);

    const currBarElement = this._barElements[currIdx];

    let delay = 0;
    let duration = 500;

    // If we have a previous annotation that needs to be faded out do so
    if (currBarElement) {
      console.log(`MirroredBarChart: _animateForward: reveal`);
      currBarElement
        .transition()
        .ease(d3.easeLinear)
        .delay(delay)
        .duration(duration)
        .style("opacity", 1);
    }
  }

  /**
   * Select all elements below svg with the selector "svg > *" and remove.
   * Otherwise it will keep drawing on top of the previous lines / scales.
   */
  _clearSvg() {
    d3.select(this._svg).selectAll("svg > *").remove();
  }

  /**************************************************************************************************************
   * Getters
   **************************************************************************************************************/

  getXScale() {
    return this._xScale;
  }

  getYScale() {
    return this._yScale1;
  }

  getYScale2() {
    return this._yScale2;
  }

  // title(title) {
  //   this._title = title;
  //   return this;
  // }

  // xLabel(xLabel) {
  //   this._xLabel = xLabel;
  //   return this;
  // }

  // yLabel1(yLabel) {
  //   this._yLabel1 = yLabel;
  //   return this;
  // }

  // yLabel2(yLabel) {
  //   this._yLabel2 = yLabel;
  //   return this;
  // }

  // color2(color: string) {
  //   this._color2 = color;
  //   return this;
  // }

  // color1(color: string) {
  //   this._color1 = color;
  //   return this;
  // }

  // ticks(ticks) {
  //   this._ticks = ticks;
  //   return this;
  // }

  // height(height) {
  //   this._height = height;
  //   return this;
  // }

  // width(width) {
  //   this._width = width;
  //   return this;
  // }

  // margin(margin) {
  //   this._margin = margin;
  //   return this;
  // }

  /**
   * The svg canvas is passed as an argument.
   */
  //   svg(svg) {
  //     this._svg = svg;

  //     const bounds = svg.getBoundingClientRect();
  //     this.height = bounds.height;
  //     this.width = bounds.width;

  //     return this;
  //   }

  //   data1(data: TimeSeriesData) {
  //     this._data = data;
  //     return this;
  //   }
}

// const xScale = (data: TimeSeriesData, w = WIDTH, m = MARGIN) => {
//   const xScale = d3
//     .scaleTime()
//     .domain(d3.extent(data, (d: TimeSeriesPoint) => d.date))
//     .nice()
//     .range([m.left, w - m.right]);
//   return xScale;
// };

// const yScale1 = (data: TimeSeriesData, h = HEIGHT, m = MARGIN) => {
//   const yScale = d3
//     .scaleLinear()
//     .domain([0, d3.max(data, (d: TimeSeriesData) => d.mean_test_accuracy)])
//     // .domain(d3.extent(data, (d: TimeSeriesData) => d.mean_test_accuracy))
//     .nice()
//     .range([(h - m.top - m.bottom) / 2, m.top]);
//   return yScale;
// };

// const yScale2 = (data: TimeSeriesData, h = HEIGHT, m = MARGIN) => {
//   const yScale = d3
//     .scaleLinear()
//     .domain([0, d3.max(data, (d: TimeSeriesData) => d.y)])
//     //.domain(d3.extent(data, (d: TimeSeriesData) => d.y))
//     .nice()
//     .range([(h - m.bottom - m.top) / 2, h - m.bottom]);
//   return yScale;
// };
