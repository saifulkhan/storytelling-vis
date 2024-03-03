import * as d3 from "d3";
import { AnimationType } from "src/models/AnimationType";
import { NumericalFeatureType } from "../../../utils/storyboards/processing/NumericalFeatureType";
import { GraphAnnotation, TSPAnnotation } from "./GraphAnnotation";

export type TSPData = {
  date: Date;
  y: number;
};

const WIDTH = 1200,
  HEIGHT = 250,
  MARGIN = { top: 50, right: 50, bottom: 50, left: 50 };
const YAXIS_LABEL_OFFSET = 10;
const MAGIC_NO = 10,
  FONT_SIZE = "12px",
  TITLE_FONT_SIZE = "13px";

const xScale = (data: TSPData[], w = WIDTH, m = MARGIN) => {
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d: TSPData) => d.date)) // TODO: check if this is correct
    .nice()
    .range([m.left, w - m.right]);
  return xScale;
};

const yScale = (data: TSPData[], h = HEIGHT, m = MARGIN) => {
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d: TSPData) => d.y)]) // TODO: check if this is correct
    .nice()
    .range([h - m.bottom, m.top]);
  return yScale;
};

export class TimeSeriesPlot {
  _selector: string;
  _svg: SVGSVGElement;
  _data1: TSPData[];
  _data2: TSPData[][];

  _width: number;
  _height: number;
  _margin: { top: number; right: number; bottom: number; left: number };

  _ticks = false;

  _title = "";
  _xLabel = "";
  _yLabel1 = "";
  _yLabel2 = "";

  _color1 = "Black";
  _strokeWidth1 = 2;
  _color2: any[];

  _showLine1Dots = false; // TODO rename point or dot
  _line1DotColor = "#A9A9A9";
  _showEventLines = true;

  _xScale: any;
  _yScale1: any;
  _yScale2: any;
  _isSameScale = false;

  annotations: TSPAnnotation[];
  _annotationOnTop = false;
  _animationCounter = 0;

  lineElements = [];
  dotElements = [];

  constructor() {
    //
  }

  /*****************************************************************************
   * Setters
   *****************************************************************************/

  /**
   ** We pass height, width & margin here to keep it consistent with the svg() method.
   ** All stories except story 3 use this method.
   **/
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
   ** The svg canvas is passed as an argument. (The story 3 used similar method.)
   **/
  svg(svg) {
    this._svg = svg;

    const bounds = svg.getBoundingClientRect();
    this.height = bounds.height;
    this.width = bounds.width;

    return this;
  }

  data1(data1: TSPData[]) {
    this._data1 = data1;
    return this;
  }

  data2(data2: TSPData[][]) {
    this._data2 = data2;
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

  yLabel(yLabel) {
    this._yLabel1 = yLabel;
    return this;
  }

  yLabel2(yLabel) {
    this._yLabel2 = yLabel;
    return this;
  }

  color2(color: string[]) {
    this._color2 = color;
    return this;
  }

  color1(color: string) {
    this._color1 = color;
    return this;
  }

  strokeWidth1(strokeWidth: number) {
    this._strokeWidth1 = strokeWidth;
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

  showLine1Dots() {
    this._showLine1Dots = true;
    return this;
  }

  line1DotColor(pointsColor1) {
    this._line1DotColor = pointsColor1;
    return this;
  }

  showEventLines() {
    this._showEventLines = true;
    return this;
  }

  /*****************************************************************************
   ** Static line and dots
   *****************************************************************************/

  /**
   ** Static plot - simply add static path derived from the data points.
   **/
  plot() {
    console.log("TimeSeriesPlot: plot:");
    this.clear();
    this.drawAxisAndLabels();

    console.log(this._data1, this._color1);

    const line1 = d3
      .line()
      .x((d) => {
        return this._xScale(d.date);
      })
      .y((d) => {
        return this._yScale1(d.y);
      });

    // Draw data1 line
    d3.select(this._svg)
      .append("path")
      .attr("stroke", this._color1)
      .attr("stroke-width", this._strokeWidth1)
      .attr("fill", "none")
      .attr("d", line1(this._data1));

    // Draw all data2 lines
    if (this._data2) {
      const colors = this._color2;
      this._data2.forEach((data, i) => {
        d3.select(this._svg)
          .append("path")
          .attr("stroke", colors ? colors[i % colors.length] : this._color1)
          .attr("stroke-width", 3)
          .attr("fill", "none")
          .attr(
            "d",
            d3
              .line()
              .x((d) => this._xScale(d.date))
              .y((d) => this._yScale2(d.y))(data),
          );
      });
    }

    //
    // Add static annotations
    //
    if (this.annotations) {
      this.annotations.forEach((d, idx) => {
        d.graphAnnotation &&
          d.graphAnnotation.id(`id-annotation-${idx}`).addTo(this._svg);
      });
      if (this._showEventLines) {
        const container = d3.select(this._svg);
        this.annotations.forEach(
          (d) =>
            d.graphAnnotation &&
            this.addEventLine(
              container,
              d.graphAnnotation._tx,
              d.graphAnnotation._ty,
            ),
        );
      }
    }

    // Show points of data1
    if (this._showLine1Dots) {
      d3.select(this._svg)
        .append("g")
        .selectAll("circle")
        .data(this._data1)
        .join("circle")
        .attr("r", 3)
        .attr("cx", (d) => this._xScale(d.date))
        .attr("cy", (d) => this._yScale1(d.y))
        .style("fill", this._line1DotColor);
    }

    return this._svg;
  }

  /**
   ** Create axes and add labels
   **/
  private drawAxisAndLabels() {
    console.log(`TimeSeriesPlot:_drawAxisAndLabels:`);

    // Combine all data before creating axis
    const data2Comb = this._data2?.reduce((comb, arr) => comb.concat(arr));
    const data1Data2Comb = data2Comb
      ? this._data1.concat(data2Comb)
      : this._data1;

    this._xScale = xScale(data1Data2Comb, this._width, this._margin);
    // Making all axis same scale
    this._yScale1 = yScale(data1Data2Comb, this._height, this._margin);
    this._yScale2 = this._yScale1;

    // Clear axes and labels
    d3.select(this._svg).selectAll("#id-axes-labels").remove();

    const selection = d3
      .select(this._svg)
      .append("g")
      .attr("id", "id-axes-labels");

    const xAxis = d3.axisBottom(this._xScale);
    this._ticks && xAxis.ticks(this._ticks);
    selection
      .append("g")
      .attr("transform", `translate(0, ${this._height - this._margin.bottom})`)
      .call(xAxis)
      .style("font-size", FONT_SIZE);

    selection
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this._width / 2)
      .attr("y", this._height - 5)
      .text(this._xLabel);

    const axisLeft = d3.axisLeft(this._yScale1).tickFormat((d) => {
      let prefix = d3.formatPrefix(".0", d);
      return prefix(d);
    });
    selection
      .append("g")
      .attr("transform", `translate(${this._margin.left}, 0)`)
      .call(axisLeft)
      .style("font-size", FONT_SIZE);

    selection
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this._height / 2)
      .attr("y", YAXIS_LABEL_OFFSET)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this._yLabel1?.toLowerCase());

    if (this._data2 && !this._isSameScale) {
      const axisRight = d3.axisRight(this._yScale2).tickFormat((d) => {
        let prefix = d3.formatPrefix(".0", d);
        return prefix(d);
      });
      selection
        .append("g")
        .attr("transform", `translate(${this._width - this._margin.right},0)`)
        .call(axisRight)
        .style("font-size", FONT_SIZE);

      selection
        .append("text")
        .attr("transform", "rotate(90)")
        .attr("x", this._height / 2)
        .attr("y", -this._width + 15)
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .text(this._yLabel2);
    }

    // Display Title
    selection
      .append("text")
      .style("font-size", "px")
      .attr("x", this._width / 2)
      .attr("y", this._margin.top + MAGIC_NO)
      .attr("text-anchor", "middle")
      .text(this._title)
      .attr("font-weight", "bold")
      .style("fill", "#696969")
      .style("font-size", TITLE_FONT_SIZE);

    if (this._showLine1Dots) {
      selection
        .append("g")
        .selectAll("circle")
        .data(this._data1.map(Object.values))
        .join("circle")
        .attr("r", 3)
        .attr("cx", (d) => this._xScale(d[0]))
        .attr("cy", (d) => this._yScale1(d[1]))
        .style("fill", this._color1);
    }

    return this;
  }

  /*****************************************************************************
   ** Annotation & animation
   *****************************************************************************/

  annotationOnTop() {
    this._annotationOnTop = true;
    return this;
  }

  /**
   ** Set annotations and their coordinates
   **/
  annotate(annotations: TSPAnnotation[]) {
    this.annotations = annotations;
    // prettier-ignore
    console.log("TimeSeriesPlot: annotations: annotations = ", annotations);

    // We need to draw the axis and labels before we can compute the coordinates
    // of the annotations
    this.drawAxisAndLabels();

    // Draw the lines and dots first so that annotations can be drawn on top
    this.createLines();
    if (this._showLine1Dots) {
      this.createDots();
    }
    this.createAnnotations();

    return this;
  }

  private createLines() {
    // prettier-ignore
    console.log("TimeSeriesPlot: createLines: _data1: ", this._data1, "data2: ", this._data2);

    this.lineElements = this.annotations.map((d: TSPAnnotation) => {
      console.log("TimeSeriesPlot: createLines: annotation, d = ", d);

      // TODO: Fix this case for 2 lines
      // const mergedData2Group = this._data2.group.map((d) => d);
      // const mergedData2Group = this._data2[0];
      // console.log("TimeSeriesPlot: createLines: mergedData2Group", mergedData2Group);

      // Slice data points within the start and end idx of the segment
      let subPoints;
      if (d.useData2 && this._data2[0]) {
        subPoints = this._data2[0].slice(d.start, d.end + 1);
      } else {
        subPoints = this._data1.slice(d.start, d.end + 1);
      }

      const path = d3
        .select(this._svg)
        .append("path")
        .attr("stroke", d.color || this._color1)
        .attr("stroke-width", this._strokeWidth1)
        .attr("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x((d) => this._xScale(d.date))
            .y((d) => (d.useData2 ? this._yScale2(d.y) : this._yScale1(d.y)))(
            subPoints,
          ),
        );

      const length = path.node().getTotalLength();

      // Set the path to be hidden initially
      path
        .attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length);

      const duration = d.duration || length * 4;
      return { path: path, length: length, duration: duration };
    });

    // prettier-ignore
    console.log("TimeSeriesPlot: createLines: _pathElements: ", this.lineElements);
  }

  private createDots() {
    // TODO: We don't want to create excessive number of dots
    this.dotElements = this.annotations.map((d: TSPAnnotation) => {
      console.log("TimeSeriesPlot: createDots: annotation, d = ", d);
      const point = this._data1[d.end];

      // Take the first data point of the segment to draw a dot
      const dotElement = d3
        .select(this._svg)
        .append("circle")
        .attr("r", 3)
        .attr("cx", () => this._xScale(point.date))
        .attr("cy", () => this._yScale1(point.y))
        .style("fill", this._line1DotColor)
        .style("opacity", 0);

      return dotElement;
    });

    // prettier-ignore
    console.log("TimeSeriesPlot: createDots: _dotElements: ", this.dotElements);
  }

  /**
   ** Compute annotation position and add to the timeseries svg
   **/
  private createAnnotations() {
    // Middle of the x-axis
    const xMid = (this._xScale.range()[0] + this._xScale.range()[1]) / 2;
    console.log("TimeSeriesPlot: createAnnotations: xMid = ", xMid);

    this.annotations.forEach((d: TSPAnnotation, idx) => {
      const graphAnnotation: GraphAnnotation = d.graphAnnotation;
      if (!graphAnnotation) return;

      // Set the coordinates of the annotation
      graphAnnotation.x(this._xScale(graphAnnotation.unscaledTarget[0]));
      graphAnnotation.y(this._height / 2 + this._margin.top);

      graphAnnotation.target(
        this._xScale(graphAnnotation.unscaledTarget[0]),
        this._yScale1(graphAnnotation.unscaledTarget[1]),
        true,
        {
          left: graphAnnotation._x >= xMid, // align left
          right: graphAnnotation._x < xMid, // align right
        },
      );

      // Add to svg
      graphAnnotation.id(`id-annotation-${idx}`).addTo(this._svg);

      if (this._annotationOnTop) {
        graphAnnotation.y(this._margin.top + graphAnnotation._annoHeight / 2);
        graphAnnotation.updatePos(graphAnnotation._x, graphAnnotation._y);
      }

      // Hide the annotation initially
      graphAnnotation.hideAnnotation();

      // Show the event line (dotted line) if enabled
      if (this._showEventLines) {
        const container = d3.select(`#id-annotation-${idx}`);
        this.addEventLine(container, graphAnnotation._tx, graphAnnotation._ty);
      }
    });

    // prettier-ignore
    console.log("TimeSeriesPlot: createAnnotations: annotations = ", this.annotations);
  }

  private addEventLine(container, x, y) {
    container
      .append("line")
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x)
      .attr("y2", this._height - this._margin.bottom)
      .attr("stroke-dasharray", 5)
      .style("stroke-width", 1)
      .style("stroke", "#999999")
      .style("fill", "none");
  }

  /**
   ** Loop through all the annotation objects, creates array of objects representing
   ** (for each annotation) segment path, their length and animation duration
   */

  public animate(animationType: AnimationType) {
    console.log("TimeSeriesPlot: animate: animationType = ", animationType);

    if (animationType === "back" && this._animationCounter >= 0) {
      this._animateBack();
      this._animationCounter -= 1;
    } else if (animationType === "beginning") {
      this._animateBeginning();
      this._animationCounter = -1;
    } else if (
      animationType === "play" &&
      this._animationCounter + 1 < this.annotations.length
    ) {
      this.play();
      this._animationCounter += 1;
    }

    // prettier-ignore
    console.log("TimeSeriesPlot: animate: _animationCounter: ", this._animationCounter)
  }

  /**
   ** This will show or hide the path elements to svg based on the animation counter value
   **/
  private play() {
    const DELAY_500MS = 500,
      DELAY_1S = 1000,
      DURATION_500MS = 500,
      DURATION_1S = 1000;

    const currIdx = this._animationCounter;
    const prevIdx = this._animationCounter - 1;
    const currAnn: TSPAnnotation = this.annotations[currIdx];
    const prevAnn: TSPAnnotation = this.annotations[prevIdx];

    const showPath = (idx: number, delay = 0) => {
      const element = this.lineElements[idx];
      if (!element) return delay;

      // We need to delay the line animations (value is 1000 if true)
      const duration = element.duration || DURATION_1S;
      // Animate current path with duration given by user
      element.path
        .transition()
        .ease(d3.easeLinear)
        .delay(delay)
        .duration(duration)
        .attr("stroke-dashoffset", 0);
      return delay + duration;
    };

    const showDot = (idx: number, delay = 0) => {
      const element = this.dotElements[idx];
      if (!element) return delay;

      const duration = DURATION_500MS;
      element
        .transition()
        .ease(d3.easeLinear)
        .delay(delay)
        .duration(duration)
        .style("opacity", 1);
      return delay + duration;
    };

    // Hide previous CURRENT annotation
    if (prevAnn?.featureType === NumericalFeatureType.CURRENT) {
      prevAnn?.graphAnnotation.hideAnnotation();
    }

    // Hide previous MAX annotation box
    if (prevAnn?.featureType === NumericalFeatureType.MAX) {
      prevAnn?.graphAnnotation.hideMessage();
    }

    // Check if there is any past MAX annotation exists
    if (currAnn?.featureType === NumericalFeatureType.MAX) {
      this.annotations.slice(0, currIdx).forEach((d, idx) => {
        if (d.featureType === NumericalFeatureType.MAX) {
          d?.graphAnnotation.hideAnnotation();
        }
      });
    }

    let delay = 0;
    delay = showPath(currIdx, delay);
    delay = showDot(currIdx, delay);
    delay = currAnn.graphAnnotation.showAnnotation(delay);
  }

  /**
   ** This will remove the current path
   ** Show or hide the path elements to svg based on the animation counter value
   **/
  _animateBeginning() {
    // TODO: Fix this function

    const idxTo = 0;
    const idxFrom = this._animationCounter + 1;
    console.log(`TimeSeriesPlot: _animateBeginning: ${idxTo} <- ${idxFrom}`);

    // Disappear all annotations
    this.annotationElements.forEach((d) => {
      d.element?.style("opacity", 0);
    });

    // Hide dots
    this.dotElements.forEach((d) => {
      d?.style("opacity", 0);
    });

    // Disappear lines from back
    this.lineElements
      .slice(idxTo, idxFrom + 1)
      .reverse()
      .forEach((d, i) => {
        d.path
          .transition()
          .ease(d3.easeLinear)
          .delay(500 * i) // TODO timing
          .duration(d.duration || 1000)
          .attr("stroke-dashoffset", d.length);
      });

    return;
  }

  /**
   ** This will remove the current path
   ** Show or hide the path elements to svg based on the animation counter value
   **/
  _animateBack() {
    // TODO: Fix this function

    const currentIndex = this._animationCounter;
    // prettier-ignore
    console.log(`TimeSeriesPlot: _animateBack: ${currentIndex} <- ${currentIndex + 1}`);

    // Hide all annotations first
    this.annotationElements.forEach((d) => {
      d.element?.style("opacity", 0);
    });

    let delay = 500;
    const duration = 500;

    // Hide the dot
    const dotElement = this.dotElements[currentIndex];
    if (dotElement) {
      delay += duration;
      dotElement
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 0);
    }

    // Disappear lines from back
    this.lineElements
      .slice(currentIndex, currentIndex + 1)
      .reverse()
      .forEach((d) => {
        // console.log(d);
        d.path
          .transition()
          .ease(d3.easeLinear)
          .delay(delay)
          .duration(duration)
          .attr("stroke-dashoffset", d.length);
      });

    // Show the earlier annotation
    const annotationElement = this.annotationElements[currentIndex - 1];
    if (annotationElement) {
      delay += duration;
      annotationElement.element
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 1);
    }
  }

  /*****************************************************************************
   ** Other functions
   *****************************************************************************/

  /**
   ** Select all elements below svg with the selector "svg > *" and remove.
   ** Otherwise it will keep drawing on top of the previous lines / scales.
   **/
  private clear() {
    d3.select(this._svg).selectAll("svg > *").remove();
  }

  public getXScale() {
    return this._xScale;
  }

  public getYScale() {
    return this._yScale1;
  }

  public getYScale2() {
    return this._yScale2;
  }
}
