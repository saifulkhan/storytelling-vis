import * as d3 from "d3";
import { AnimationType } from "src/models/AnimationType";
import { TSPAnnotation } from "./GraphAnnotation";

export type MirroredBarChartData = {
  date: Date;
  y: number; // parameter
  mean_test_accuracy?: number;
  mean_training_accuracy?: number;
};

const WIDTH = 1200,
  HEIGHT = 400,
  MARGIN = { top: 50, right: 50, bottom: 50, left: 50 };
const BAR_WIDTH = 3,
  BAR_XAXIS_GAP = 2,
  YAXIS_LABEL_OFFSET = 10,
  FONT_SIZE = "12px",
  YAXIS_LABEL_FONT_SIZE = "14px";

const xScale = (data: MirroredBarChartData[], w = WIDTH, m = MARGIN) => {
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d: MirroredBarChartData) => d.date))
    .nice()
    .range([m.left, w - m.right]);
  return xScale;
};

const yScale1 = (data: MirroredBarChartData[], h = HEIGHT, m = MARGIN) => {
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d: MirroredBarChartData) => d.mean_test_accuracy),
    ])
    // .domain(d3.extent(data, (d: MirroredBarChartData) => d.mean_test_accuracy))
    .nice()
    .range([(h - m.top - m.bottom) / 2, m.top]);
  return yScale;
};

const yScale2 = (data: MirroredBarChartData[], h = HEIGHT, m = MARGIN) => {
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d: MirroredBarChartData) => d.y)])
    //.domain(d3.extent(data, (d: MirroredBarChartData) => d.y))
    .nice()
    .range([(h - m.bottom - m.top) / 2, h - m.bottom]);
  return yScale;
};

export class MirroredBarChart {
  _selector: string;
  _svg: SVGSVGElement;
  _data: MirroredBarChartData[];

  _title = "";
  _xLabel = "";
  _yLabel1 = "";
  _yLabel2 = "";
  _color1 = "Black";
  _color2 = "Blue";
  _width: number;
  _height: number;
  _margin: { top: number; right: number; bottom: number; left: number };
  _ticks = false;

  _xScale: any;
  _yScale1: any;
  _yScale2: any;

  _lpAnnotations: TSPAnnotation[];
  _annoTop = false;
  _animationCounter = 0;

  _barElements = [];

  constructor() {
    //
  }

  /**************************************************************************************************************
   * Setters
   **************************************************************************************************************/

  /**
   * We pass height, width & margin here to keep it consistent with the svg() method.
   */
  selector(selector, height = HEIGHT, width = WIDTH, margin = MARGIN) {
    this._selector = selector;
    this._height = height;
    this._width = width;
    this._margin = margin;

    d3.select(this._selector).select("svg").remove();

    this._svg = d3
      .select(this._selector)
      .append("svg")
      .attr("width", this._width)
      .attr("height", this._height)
      // .style("background-color", "pink") // debug
      .node();

    return this;
  }

  /**
   * The svg canvas is passed as an argument.
   */
  svg(svg) {
    this._svg = svg;

    const bounds = svg.getBoundingClientRect();
    this.height = bounds.height;
    this.width = bounds.width;

    return this;
  }

  data1(data: MirroredBarChartData[]) {
    this._data = data;
    return this;
  }

  title(title) {
    this._title = title;
    return this;
  }

  xLabel(xLabel) {
    this._xLabel = xLabel;
    return this;
  }

  yLabel1(yLabel) {
    this._yLabel1 = yLabel;
    return this;
  }

  yLabel2(yLabel) {
    this._yLabel2 = yLabel;
    return this;
  }

  color2(color: string) {
    this._color2 = color;
    return this;
  }

  color1(color: string) {
    this._color1 = color;
    return this;
  }

  ticks(ticks) {
    this._ticks = ticks;
    return this;
  }

  height(height) {
    this._height = height;
    return this;
  }

  width(width) {
    this._width = width;
    return this;
  }

  margin(margin) {
    this._margin = margin;
    return this;
  }

  /**
   * x
   */
  annotations(lpAnnotations: TSPAnnotation[]) {
    this._drawAxisAndLabels();

    this._lpAnnotations = lpAnnotations;
    // prettier-ignore
    console.log("MirroredBarChart: graphAnnotations: after lpAnnotations = ", this._lpAnnotations);

    return this;
  }

  /**************************************************************************************************************
   * Drawing methods
   **************************************************************************************************************/

  /*
   * When we don't want to animate- simply add static path derived from the data points.
   */
  plot() {
    console.log("MirroredBarChart: plot:");
    this._drawAxisAndLabels();

    d3.select(this._svg)
      .selectAll("bar")
      .data(this._data)
      .join("rect")
      .attr("x", (d) => this._xScale(d.date))
      .attr("y", (d) => this._yScale1(d.mean_test_accuracy) - BAR_XAXIS_GAP)
      .attr("width", BAR_WIDTH)
      .attr(
        "height",
        (d) => this._yScale1(0) - this._yScale1(d.mean_test_accuracy),
      )
      .attr("fill", this._color1);

    d3.select(this._svg)
      .selectAll("bar")
      .data(this._data)
      .join("rect")
      .attr("x", (d) => this._xScale(d.date))
      .attr(
        "y",
        (d) =>
          (this._height - this._margin.top - this._margin.bottom) / 2 +
          BAR_XAXIS_GAP,
      )
      .attr("width", BAR_WIDTH)
      .attr("height", (d) => -this._yScale2(0) + this._yScale2(d.y))
      .attr("fill", this._color2);

    return this._svg;
  }

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
          (d) => this._yScale1(point.mean_test_accuracy) - BAR_XAXIS_GAP,
        )
        .attr("width", BAR_WIDTH)
        .attr(
          "height",
          (d) => this._yScale1(0) - this._yScale1(point.mean_test_accuracy),
        )
        .attr("fill", this._color1);

      barElement
        .append("rect")
        .attr("x", (d) => this._xScale(point.date))
        .attr(
          "y",
          (d) =>
            (this._height - this._margin.top - this._margin.bottom) / 2 +
            BAR_XAXIS_GAP,
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
   * Create axes and add labels
   */
  _drawAxisAndLabels() {
    console.log(`MirroredBarChart:_drawAxisAndLabels:`);
    console.log("MirroredBarChart:_drawAxisAndLabels: data1 = ", this._data);

    this._xScale = xScale(this._data, this._width, this._margin);
    this._yScale1 = yScale1(this._data, this._height, this._margin);
    this._yScale2 = yScale2(this._data, this._height, this._margin);

    // Clear axes and labels
    d3.select(this._svg).selectAll("#id-axes-labels").remove();

    const selection = d3
      .select(this._svg)
      .append("g")
      .attr("id", "id-axes-labels");

    // Create the X-axis in middle
    const xAxis = d3.axisBottom(this._xScale);
    this._ticks && xAxis.ticks(this._ticks);
    selection
      .append("g")
      .attr(
        "transform",
        `translate(0, ${
          (this._height - this._margin.top - this._margin.bottom) / 2
        })`,
      )
      .call(xAxis)
      .style("font-size", FONT_SIZE)
      // label
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this._width / 2)
      .attr("y", this._height - 5)
      .text(this._xLabel);

    // Create the top Y-axis
    const yAxisTop = d3.axisLeft(this._yScale1);
    yAxisTop.ticks(5);
    selection
      .append("g")
      .attr("transform", `translate(${this._margin.left}, 0)`)
      .call(yAxisTop)
      .style("font-size", FONT_SIZE)
      // label
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this._height / 4)
      .attr("y", -this._margin.left + YAXIS_LABEL_OFFSET)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this._yLabel1)
      .style("font-size", YAXIS_LABEL_FONT_SIZE)
      .style("fill", "black");

    // Create the bottom y-axis
    const yAxisBottom = d3.axisLeft(this._yScale2);
    yAxisBottom.ticks(5).tickFormat((d) => {
      let prefix = d3.formatPrefix(".0", d);
      return prefix(d);
    });

    selection
      .append("g")
      .attr("transform", `translate(${this._margin.left}, 0)`)
      .call(yAxisBottom)
      .style("font-size", FONT_SIZE)
      // label
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this._height / 1.5)
      .attr("y", -this._margin.left + YAXIS_LABEL_OFFSET)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this._yLabel2)
      .style("font-size", YAXIS_LABEL_FONT_SIZE)
      .style("fill", "black");

    return this;
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
}
