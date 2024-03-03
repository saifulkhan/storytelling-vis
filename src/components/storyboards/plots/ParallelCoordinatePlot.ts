import * as d3 from "d3";
import { AnimationType } from "src/models/AnimationType";
import { Color } from "../Colors";
import { GraphAnnotation, PCPAnnotation } from "./GraphAnnotation";
import { NumericalFeatureType } from "../../../utils/storyboards/processing/NumericalFeatureType";

const WIDTH = 800,
  HEIGHT = 600,
  MARGIN = { top: 70, right: 50, bottom: 30, left: 50 };

const STATIC_LINE_COLORMAP = d3.interpolateBrBG,
  STATIC_LINE_OPACITY = 0.4,
  STATIC_DOT_OPACITY = 0.4;

const LINE_WIDTH = 1.5,
  DOT_RADIUS = 5,
  SELECTED_AXIS_COLOR = Color.Red,
  DELAY = 500,
  DURATION1 = 1000,
  FONT_SIZE = "12px";

const ANNO_Y_POS = 20,
  ANNO_X_POS = 75;

const xScaleMap = (data, keys, width, margin) => {
  return new Map(
    Array.from(keys, (key) => {
      // array of all keys, e.g.,  ['date', 'mean_test_accuracy', 'channels', 'kernel_size', 'layers', ...]
      // key is one of teh key, e.g., 'date'
      let scale;
      if (key === "date") {
        scale = d3.scaleTime(
          d3.extent(data, (d) => d[key]),
          [margin.left, width - margin.right],
        );
      } else {
        scale = d3.scaleLinear(
          d3.extent(data, (d) => +d[key]),
          [margin.left, width - margin.right],
        );
      }

      return [key, scale];
    }),
  );
};

const yScale = (keys, height, margin) => {
  return d3.scalePoint(keys, [margin.top, height - margin.bottom]);
};

export class ParallelCoordinatePlot {
  _selector: string;
  _svg: SVGSVGElement;

  _width: number;
  _height: number;
  _margin: any;

  _data: any[];
  _AxisNames: string[];
  _selectedAxis: string;

  _xScaleMap;
  _yScale;
  _colorScale;

  _annotations: PCPAnnotation[] = [];
  _animationCounter = 0;

  constructor() {
    //
  }

  /**************************************************************************************************************
   * Setters
   **************************************************************************************************************/

  /**
   * We pass height, width & margin here to keep it consistent with the svg() method.
   * All stories except story 3 use this method.
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
      .node();

    return this;
  }

  data(data: any[], keys: string[], selectedAxis: string) {
    this._data = data;
    this._AxisNames = keys;
    this._selectedAxis = selectedAxis;

    console.log("ParallelCoordinate: data = ", this._data);
    // prettier-ignore
    console.log("ParallelCoordinate: data: selector = ", this._selector, ", _AxisNames = ", this._AxisNames, ", _selectedAxis = ", this._selectedAxis);

    return this;
  }

  /*********************************************************************************************************
   * Static drawing - draw all lines
   *********************************************************************************************************/

  plot() {
    this.drawAxisAndLabels();

    const line = d3
      .line()
      .defined(([, value]) => value != null)
      .x(([key, value]) => {
        // parameter and its value, e.g., kernel_size:11, layers:13, etc
        return this._xScaleMap.get(key)(value);
      })
      .y(([key]) => this._yScale(key));

    const cross = (d) =>
      d3.cross(this._AxisNames, [d], (key, d) => [key, +d[key]]);

    //
    // Draw lines
    //
    d3.select(this._svg)
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", LINE_WIDTH)
      .attr("stroke-opacity", STATIC_LINE_OPACITY)
      .selectAll("path")
      .data(this._data)
      .join("path")
      .attr("stroke", (d) => this._colorScale(d[this._selectedAxis])) // assign from a colormap
      .attr("d", (d) => {
        // d is a row of the data, e.g., {kernel_size: 11, layers: 13, ...}
        // cross returns an array of [key, value] pairs ['date', 1677603855000], ['mean_training_accuracy', 0.9], ['channels', 32], ['kernel_size', 3], ['layers', 13], ...
        const a = cross(d);
        const l = line(a);
        return l;
      })
      .attr("id", (d) => `id-line-${d.index}`);

    //
    // Append circles to the line
    //
    d3.select(this._svg)
      .append("g")
      .selectAll("g")
      .data(this._data)
      .enter()
      .append("g")
      .attr("id", (d) => {
        // d is a row of the data, e.g., {kernel_size: 11, layers: 13, ...}
        return `id-circles-${d.index}`;
      })
      .selectAll("circle")
      .data((d) => cross(d))
      .enter()
      .append("circle")
      .attr("r", DOT_RADIUS)
      .attr("cx", ([key, value]) => {
        // parameter and its value, e.g., kernel_size:11, layers:13, etc
        return this._xScaleMap.get(key)(value);
      })
      .attr("cy", ([key]) => this._yScale(key))
      // .style("fill", (d) => this._colorScale(d[this._selectedAxis])) // TODO: assign from _colorScale colormap
      .style("fill", "Gray")
      .style("opacity", STATIC_DOT_OPACITY);

    return this;
  }

  private drawAxisAndLabels() {
    // Clear existing axis and labels
    d3.select(this._svg).selectAll("svg > *").remove();

    this._xScaleMap = xScaleMap(
      this._data,
      this._AxisNames,
      this._width,
      this._margin,
    );
    this._yScale = yScale(this._AxisNames, this._height, this._margin);
    this._colorScale = d3.scaleSequential(
      this._xScaleMap.get(this._selectedAxis).domain().reverse(),
      STATIC_LINE_COLORMAP,
    );
    // prettier-ignore
    console.log("ParallelCoordinate: _drawAxisAndLabels: _xScaleMap = ", this._xScaleMap);

    //
    // Draw axis and labels
    //
    const that = this;
    d3.select(this._svg)
      .append("g")
      .selectAll("g")
      .data(this._AxisNames)
      .join("g")
      .attr("transform", (d) => `translate(0,${this._yScale(d)})`)
      .style("font-size", FONT_SIZE)
      .each(function (d) {
        // draw axis for d = date, layers, kernel_size, ... etc.
        // change color of the selected axis for d = keyz
        if (d === that._selectedAxis) {
          d3.select(this)
            .attr("color", SELECTED_AXIS_COLOR)
            .call(d3.axisBottom(that._xScaleMap.get(d)));
        } else {
          d3.select(this).call(d3.axisBottom(that._xScaleMap.get(d)));
        }
      })
      // Label axis
      .call((g) =>
        g
          .append("text")
          .attr("x", this._margin.left)
          .attr("y", -6)
          .attr("text-anchor", "start")
          .attr("fill", (d) =>
            // change color of the selected axis label for d = keyz
            d === this._selectedAxis ? SELECTED_AXIS_COLOR : "currentColor",
          )
          .text((d) => d),
      );

    return this;
  }

  /*********************************************************************************************************
   * Animation used in story 6
   *********************************************************************************************************/

  /**
   * Set annotations.
   */
  public annotations(pcAnnotations: PCPAnnotation[]) {
    this._annotations = pcAnnotations;
    // prettier-ignore
    console.log("ParallelCoordinate: annotations: _pcAnnotations = ", this._annotations);

    // We need to draw the axis and labels before we can compute the coordinates of the annotations
    this.drawAxisAndLabels();
    this.createLinesAndDots();
    this.createAnnotations();

    // prettier-ignore
    console.log("ParallelCoordinate: annotations: _pcAnnotations = ", this._annotations);
    return this;
  }

  /**
   *
   */
  public animate(animationType: AnimationType) {
    console.log("TimeSeries: animate: animationType = ", animationType);

    if (animationType === "back" && this._animationCounter >= 0) {
      this._animateBack();
    } else if (animationType === "beginning") {
      this._animateBeginning();
    } else if (
      animationType === "play" &&
      this._animationCounter <= this._annotations.length - 1
    ) {
      this._animateForward();
    }

    // prettier-ignore
    console.log("TimeSeries: animate: _animationCounter: ", this._animationCounter)
  }

  private createLinesAndDots() {
    const line = d3
      .line()
      .defined(([, value]) => value != null)
      .x(([key, value]) => {
        // parameter and its value, e.g., kernel_size: 11, layers: 13, etc
        return this._xScaleMap.get(key)(value);
      })
      .y(([key]) => this._yScale(key));

    const cross = (d) => {
      // given d is a row of the data, e.g., {date: 1677603855000, kernel_size: 11, layers: 13, ...},
      // cross returns an array of [key, value] pairs ['date', 1677603855000], ['mean_training_accuracy', 0.9], ['channels', 32], ['kernel_size', 3], ['layers', 13], ...
      return d3.cross(this._AxisNames, [d], (key, d) => [key, +d[key]]);
    };

    //
    // Draw lines
    //
    d3.select(this._svg)
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", LINE_WIDTH)
      .attr("stroke-opacity", 0)
      .selectAll("path")
      .data(this._annotations)
      .join("path")
      .attr("stroke", (d) => d?.lineColor)
      .attr("d", (d: PCPAnnotation) => {
        // d.data is a data point, e.g., {kernel_size: 11, layers: 13, ...}
        // cross returns an array of [key, value] pairs ['date', 1677603855000], ['mean_training_accuracy', 0.9], ['channels', 32], ['kernel_size', 3], ['layers', 13], ...
        const a = cross(d?.data);
        const l = line(a);
        return l;
      })
      .attr("id", (d) => `id-line-${d?.data?.index}`);

    //
    // Append circles to the line
    //
    const that = this;
    d3.select(this._svg)
      .append("g")
      .selectAll("g")
      .data(this._annotations)
      .enter()
      .append("g")
      .attr("id", (d) => {
        // d is a row of the data, e.g., {kernel_size: 11, layers: 13, ...}
        return `id-circles-${d?.data?.index}`;
      })
      .selectAll("circle")
      .data((d) => cross(d?.data))
      .enter()
      .append("circle")
      .attr("r", DOT_RADIUS)
      .attr("cx", ([key, value]) => {
        // parameter and its value, e.g., key/value: kernel_size/11, layers/13, etc
        const xScale = this._xScaleMap.get(key);
        return xScale(value);
      })
      .attr("cy", ([key]) => this._yScale(key))
      .style("fill", function (d) {
        // get the parent node data, i.e., pcAnnotation
        const parent = d3.select(this.parentNode).datum();
        return parent?.dotColor;
      })
      .style("opacity", 0);
  }

  private createAnnotations() {
    // Middle of the any x-axis
    const dateScale = this._xScaleMap.get("date");
    const xMid =
      (dateScale(this._data[this._data.length - 1].date) +
        dateScale(this._data[0].date)) *
      0.5;
    console.log("ParallelCoordinate: graphAnnotations: xMid = ", xMid);

    // Position annotations & hide them
    this._annotations.forEach((d, idx) => {
      // Try to get the graphAnnotation object if undefined set array elem to false
      const graphAnnotation: GraphAnnotation = d?.graphAnnotation;
      if (!graphAnnotation) {
        return;
      }

      if (d && graphAnnotation) {
        const xScale = this._xScaleMap.get(d.originAxis);
        const x = xScale(d.data[d.originAxis]);
        const y = this._yScale(d.originAxis);

        graphAnnotation.x(x);
        graphAnnotation.y(y);

        // If add to svg and set opacity to 0 (to hide it)
        graphAnnotation.id(`id-annotation-${idx}`).addTo(this._svg);
        graphAnnotation.hideAnnotation();

        // Save the coordinates in PCAnnotation object
        d.origin = [x, y];
        if (d.featureType === NumericalFeatureType.MIN) {
          d.destination = [this._margin.right + ANNO_X_POS, ANNO_Y_POS];
        } else if (
          d.featureType === NumericalFeatureType.CURRENT ||
          d.featureType === NumericalFeatureType.LAST
        ) {
          d.destination = [xMid, ANNO_Y_POS];
        } else if (d.featureType === NumericalFeatureType.MAX) {
          d.destination = [
            this._width - this._margin.left - ANNO_X_POS,
            ANNO_Y_POS,
          ];
        }
      }
    });
  }

  private _animateForward() {
    const currIdx = this._animationCounter;
    const prevIdx = this._animationCounter - 1;
    const currAnn: PCPAnnotation = this._annotations[currIdx];
    const prevAnn: PCPAnnotation = this._annotations[prevIdx];

    // prettier-ignore
    // console.log("ParallelCoordinate: _animateForward: currAnnotation = ", currAnn);

    // Show current line & its dots
    this.shotLineWithId(currIdx);
    this.shotDotsWithId(currIdx);

    // Show the annotation and move it to its destination
    currAnn?.graphAnnotation?.showAnnotation(0);
    currAnn?.graphAnnotation?.updatePosAnimate(
      currAnn.destination[0],
      currAnn.destination[1],
    );

    // Hide previous line & its dots
    if (prevAnn?.featureType === NumericalFeatureType.CURRENT) {
      this.hideLineWithId(prevIdx);
      this.hideDotsWithId(prevIdx);
    }

    // Check if there is any past MAX line exists
    if (currAnn?.featureType === NumericalFeatureType.MAX) {
      this._annotations.slice(0, currIdx).forEach((d, idx) => {
        if (d.featureType === NumericalFeatureType.MAX) {
          this.hideLineWithId(idx);
          this.hideDotsWithId(idx);
        }
      });
    }

    // Check if there is any past MIN line exists
    if (currAnn?.featureType === NumericalFeatureType.MIN) {
      this._annotations.slice(0, currIdx).forEach((d, idx) => {
        if (d.featureType === NumericalFeatureType.MIN) {
          this.hideLineWithId(idx);
          this.hideDotsWithId(idx);
        }
      });
    }

    this._animationCounter += 1;
  }

  private _animateBeginning() {
    throw new Error("Method not implemented.");
  }
  private _animateBack() {
    throw new Error("Method not implemented.");
  }

  private shotLineWithId(id: number) {
    d3.select(this._svg).select(`#id-line-${id}`).style("stroke-opacity", 1);
  }

  private shotDotsWithId(id: number) {
    d3.select(this._svg)
      .select(`#id-circles-${id}`) // return group
      .selectAll("circle")
      .style("opacity", 1); // reveal the circles
  }

  private hideLineWithId(id: number) {
    d3.select(this._svg)
      .select(`#id-line-${id}`)
      .transition()
      .ease(d3.easeLinear)
      .delay(DELAY)
      .duration(DURATION1)
      .style("stroke-opacity", 0.5)
      .style("stroke", "#d3d3d3");
  }

  private hideDotsWithId(id: number) {
    d3.select(this._svg)
      .select(`#id-circles-${id}`) // returns group
      .selectAll("circle")
      .transition()
      .ease(d3.easeLinear)
      .delay(DELAY)
      .duration(DURATION1)
      .style("opacity", 0);
  }
}
