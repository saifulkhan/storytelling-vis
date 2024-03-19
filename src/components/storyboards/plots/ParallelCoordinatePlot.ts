import * as d3 from "d3";
import { StoryboardColors, LineColor } from "../StoryboardColors";
import { Plot, PlotProps, defaultPlotProps } from "./Plot";
import {
  findIndexOfDate,
  getObjectKeysArray,
} from "../../../utils/storyboards/data-processing/common";
import { DateActionArray } from "../../../utils/storyboards/feature-action-create/FeatureActionTypes";
import { Coordinate, Action } from "../actions/Action";
import { NumericalFeatures } from "../../../utils/storyboards/feature/NumericalFeatures";
import { HorizontalAlign, VerticalAlign } from "../../../types/Align";

export type ParallelCoordinatePlotProperties = {};

const MARGIN = { top: 70, right: 50, bottom: 30, left: 50 };

const STATIC_LINE_COLOR_MAP = d3.interpolateBrBG,
  STATIC_LINE_OPACITY = 0.4,
  STATIC_DOT_OPACITY = 0.4;

const LINE_WIDTH = 1.5,
  DOT_RADIUS = 5,
  SELECTED_AXIS_COLOR = StoryboardColors.Red,
  FONT_SIZE = "12px";

const DELAY_SHOW = 0,
  DELAY_HIDE = 500,
  DURATION_SHOW = 0,
  DURATION_HIDE = 1000;

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
          [margin.left, width - margin.right]
        );
      } else {
        scale = d3.scaleLinear(
          d3.extent(data, (d) => +d[key]),
          [margin.left, width - margin.right]
        );
      }

      return [key, scale];
    })
  );
};

const yScale = (keys, height, margin) => {
  return d3.scalePoint(keys, [margin.top, height - margin.bottom]);
};

export class ParallelCoordinatePlot extends Plot {
  public getCoordinates(...args: unknown[]): [Coordinate, Coordinate] {
    throw new Error("Method not implemented.");
  }
  data: any[];
  plotProps: PlotProps;
  svg: SVGSVGElement;
  name: string;
  actions: any[];

  width: number;
  height: number;
  margin;

  AxisNames: string[];
  selectedAxis: string;
  xScaleMap;
  yScale;
  staticLineColorMap;

  constructor() {
    super();
  }

  public setPlotProps(props: PlotProps) {
    this.plotProps = { ...defaultPlotProps, ...props };
    this.margin = this.plotProps.margin;
    console.log("margin:", this.margin);
    return this;
  }

  public plotProperties(properties: unknown) {
    throw new Error("Method not implemented.");
    return this;
  }

  public setData(data: any[]) {
    // sort data by selected key, e.g, "kernel_size"
    this.data = data
      .slice()
      .sort((a, b) => d3.ascending(a[this.name], b[this.name]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));

    this.AxisNames = getObjectKeysArray(data);
    console.log("PCP:data = ", this.data);
    console.log("PCP:data: _AxisNames = ", this.AxisNames);

    return this;
  }

  public setName(name: string) {
    this.name = name;
    this.selectedAxis = name;
    // prettier-ignore
    console.log("PCP:name: _selectedAxis = ", this.selectedAxis);

    return this;
  }

  public setCanvas(svg: SVGSVGElement) {
    this.svg = svg;
    const bounds = svg.getBoundingClientRect();
    this.height = bounds.height;
    this.width = bounds.width;

    return this;
  }

  /**
   ** Draw parallel coordinate lines & axis (static)
   **/

  public plot() {
    this.drawAxis();
    this.drawLinesAndDots();

    return this;
  }

  private drawAxis() {
    // Clear existing axis and labels
    d3.select(this.svg).selectAll("svg > *").remove();

    this.xScaleMap = xScaleMap(
      this.data,
      this.AxisNames,
      this.width,
      this.margin
    );

    this.yScale = yScale(this.AxisNames, this.height, this.margin);

    this.staticLineColorMap = d3.scaleSequential(
      this.xScaleMap.get(this.selectedAxis).domain().reverse(),
      STATIC_LINE_COLOR_MAP
    );

    // prettier-ignore
    console.log("PCP: drawAxisAndLabels: xScaleMap = ", this.xScaleMap);

    //
    // Draw axis and labels
    //
    const that = this;
    d3.select(this.svg)
      .append("g")
      .selectAll("g")
      .data(this.AxisNames)
      .join("g")
      .attr("transform", (d) => `translate(0,${this.yScale(d)})`)
      .style("font-size", FONT_SIZE)
      .each(function (d) {
        // draw axis for d = date, layers, kernel_size, ... etc.
        // change color of the selected axis for d = keyz
        if (d === that.selectedAxis) {
          d3.select(this)
            .attr("color", SELECTED_AXIS_COLOR)
            .call(d3.axisBottom(that.xScaleMap.get(d)));
        } else {
          d3.select(this).call(d3.axisBottom(that.xScaleMap.get(d)));
        }
      })
      // Label axis
      .call((g) =>
        g
          .append("text")
          .attr("x", this.margin.left)
          .attr("y", -6)
          .attr("text-anchor", "start")
          .attr("fill", (d) =>
            // change color of the selected axis label for d = keyz
            d === this.selectedAxis ? SELECTED_AXIS_COLOR : "currentColor"
          )
          .text((d) => d)
      );

    return this;
  }

  /**
   ** This will draw lines and dots.
   ** This is similar to the drawLinesAndDotsHidden() function below.
   **/
  private drawLinesAndDots() {
    const line = d3
      .line()
      .defined(([, value]) => value != null)
      .x(([key, value]) => {
        // parameter and its value, e.g., kernel_size:11, layers:13, etc
        return this.xScaleMap.get(key)(value);
      })
      .y(([key]) => this.yScale(key));

    const cross = (d) =>
      d3.cross(this.AxisNames, [d], (key, d) => [key, +d[key]]);

    //
    // Draw lines
    //
    d3.select(this.svg)
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", LINE_WIDTH)
      .attr("stroke-opacity", STATIC_LINE_OPACITY)
      .selectAll("path")
      .data(this.data)
      .join("path")
      .attr("stroke", (d) => this.staticLineColorMap(d[this.selectedAxis]))
      .attr("d", (d) => {
        // d is a row of the data, e.g., {kernel_size: 11, layers: 13, ...}
        // cross returns an array of [key, value] pairs ['date', 1677603855000], ['mean_training_accuracy', 0.9], ['channels', 32], ['kernel_size', 3], ['layers', 13], ...
        const a = cross(d);
        const l = line(a);
        return l;
      })
      .attr("id", (d) => `id-line-${d.date}`);

    //
    // Append circles to the line
    //
    d3.select(this.svg)
      .append("g")
      .selectAll("g")
      .data(this.data)
      .enter()
      .append("g")
      .attr("id", (d) => {
        // d is a row of the data, e.g., {kernel_size: 11, layers: 13, ...}
        return `id-dot-${d.date}`;
      })
      .selectAll("circle")
      .data((d) => cross(d))
      .enter()
      .append("circle")
      .attr("r", DOT_RADIUS)
      .attr("cx", ([key, value]) => {
        // parameter and its value, e.g., kernel_size:11, layers:13, etc
        return this.xScaleMap.get(key)(value);
      })
      .attr("cy", ([key]) => this.yScale(key))
      // .style("fill", (d) => this.staticLineColorMap(d[this.selectedAxis]))
      .style("fill", "Gray")
      .style("opacity", STATIC_DOT_OPACITY);
  }

  /**
   ** This will draw lines and dots but initially hidden, and revealed during animation
   ** This is similar to the drawLinesAndDots() function above.
   **/
  private drawLinesAndDotsHidden() {
    const line = d3
      .line()
      .defined(([, value]) => value != null)
      .x(([key, value]) => {
        // parameter and its value, e.g., kernel_size: 11, layers: 13, etc
        return this.xScaleMap.get(key)(value);
      })
      .y(([key]) => this.yScale(key));

    const cross = (d) => {
      // given d is a row of the data, e.g., {date: 1677603855000, kernel_size: 11, layers: 13, ...},
      // cross returns an array of [key, value] pairs ['date', 1677603855000], ['mean_training_accuracy', 0.9], ['channels', 32], ['kernel_size', 3], ['layers', 13], ...
      return d3.cross(this.AxisNames, [d], (key, d) => [key, +d[key]]);
    };

    //
    // Draw lines
    //
    d3.select(this.svg)
      .append("g")
      .selectAll("path")
      .data(this.data)
      .join("path")
      .attr("stroke", (d) => "grey") // TODO
      .attr("d", (d) => {
        // d.data is a data point, e.g., {kernel_size: 11, layers: 13, ...}
        // cross returns an array of [key, value] pairs ['date', 1677603855000], ['mean_training_accuracy', 0.9], ['channels', 32], ['kernel_size', 3], ['layers', 13], ...
        const a = cross(d);
        const l = line(a);
        return l;
      })
      .attr("fill", "none")
      .attr("stroke-width", LINE_WIDTH)
      .attr("stroke-opacity", 0) // TODO
      .attr("id", (d) => this.getLineId(d.date));

    //
    // Append dots to the line
    //
    const that = this;
    d3.select(this.svg)
      .append("g")
      .selectAll("g")
      .data(this.data)
      .enter()
      .append("g")
      .attr("id", (d) => {
        // d is a row of the data, e.g., {kernel_size: 11, layers: 13, ...}
        return this.getDotId(d.date);
      })
      .selectAll("circle")
      .data((d) => cross(d))
      .enter()
      .append("circle")
      .attr("r", DOT_RADIUS)
      .attr("cx", ([key, value]) => {
        // parameter and its value, e.g., key/value: kernel_size/11, layers/13, etc
        const xScale = this.xScaleMap.get(key);
        return xScale(value);
      })
      .attr("cy", ([key]) => this.yScale(key))
      .style("fill", function (d) {
        // get the parent node data
        // const parent = d3.select(this.parentNode).datum();
        // return parent?.dotColor;
        // TODO
        return "grey";
      })
      .style("opacity", 0); // TODO
  }

  /**
   ** Actions that will be animated.
   **/
  public setActions(actions: DateActionArray) {
    this.actions = actions?.sort((a, b) => a[0].getTime() - b[0].getTime());

    return this;
  }

  public animate() {
    // draw static
    // if (!this._actions || !this._actions.length) {
    //   this._draw();
    //   return;
    // }

    this.drawAxis();
    this.drawLinesAndDotsHidden();

    (async () => {
      let lastDate, lastFeatureType;
      for (const [date, action] of this.actions) {
        console.log("PCP:animate: action:", action);

        if (lastDate && lastFeatureType) {
          await Promise.all([
            this.hideDots(lastDate, lastFeatureType),
            this.hideLine(lastDate, lastFeatureType),
          ]);
        }

        const featureType = action.getFeatureType();
        await Promise.all([
          this.showDots(date, featureType),
          this.showLine(date, featureType),
          this.showAction(date, featureType, action),
        ]);

        lastDate = date;
        lastFeatureType = featureType;
      }
    })();
  }

  private showLine(date: Date, type: NumericalFeatures) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this.svg)
        .select(`#${this.getLineId(date)}`)
        .transition()
        // delay before transition
        .delay(DELAY_SHOW)
        // duration of the opacity transition
        .duration(DURATION_SHOW)
        .style("stroke-opacity", 1)
        .style("stroke", this.colorOnShow(type))
        .on("end", () => {
          resolve(DELAY_SHOW + DURATION_SHOW);
        });
    });
  }

  private hideLine(date: Date, type: NumericalFeatures) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this.svg)
        .select(`#${this.getLineId(date)}`)
        .transition()
        .ease(d3.easeLinear)
        .delay(DELAY_HIDE)
        .duration(DURATION_HIDE)
        .style("stroke-opacity", this.opacityOnHideLine(type))
        .style("stroke", this.colorOnHideLine(type))
        .on("end", () => {
          resolve(DELAY_HIDE + DURATION_HIDE);
        });
    });
  }

  private showDots(date: Date, type: NumericalFeatures) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this.svg)
        .select(`#${this.getDotId(date)}`) // return group
        .selectAll("circle")
        .transition()
        // delay before transition
        .delay(DELAY_SHOW)
        // duration of the opacity transition
        .duration(DURATION_SHOW)
        .style("opacity", 1)
        .style("fill", this.colorOnShow(type))
        .on("end", () => {
          resolve(DELAY_SHOW + DURATION_SHOW);
        });
    });
  }

  private hideDots(date: Date, type: NumericalFeatures) {
    return new Promise<number>((resolve, reject) => {
      d3.select(this.svg)
        .select(`#${this.getDotId(date)}`) // returns group
        .selectAll("circle")
        .transition()
        .ease(d3.easeLinear)
        .delay(DELAY_HIDE)
        .duration(DURATION_HIDE)
        .style("opacity", 0)
        .on("end", () => {
          resolve(DELAY_HIDE + DURATION_HIDE);
        });
    });
  }

  private showAction(
    date: Date,
    type: NumericalFeatures,
    action: Action
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const data = this.data[findIndexOfDate(this.data, date)];

      action
        .updateProps({
          date: date.toLocaleDateString(),
          mean_test_accuracy: data["mean_test_accuracy"],
          mean_training_accuracy: data["mean_training_accuracy"],
          horizontalAlign: "middle" as HorizontalAlign,
          verticalAlign: "top" as VerticalAlign,
        })
        .setCanvas(this.svg)
        // .setCoordinate([[0, 0], this.topMidCoordinate()]);
        .setCoordinate([[0, 0], this.coordinateOnAxis(date)]);

      console.log("PCP:showAction: action:", this.topMidCoordinate());

      return Promise.all([
        action.show(),
        action.move(this.topMidCoordinate(), 500, 2000),
      ])
        .then((results) => {
          // Assuming the desired number to resolve with is in the results array
          // You might need to adjust this depending on what exactly you're expecting
          resolve(results[0]); // or another relevant value based on the promises
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private hideAction(date: Date, type: NumericalFeatures, action: Action) {
    return new Promise<number>((resolve, reject) => {
      return action.hide();
    });
  }

  private getLineId(date: Date) {
    return `id-line-${date.getTime()}`;
  }

  private getDotId(date: Date) {
    return `id-dot-${date.getTime()}`;
  }

  private colorOnShow(type: NumericalFeatures): string {
    return LineColor[type];
  }

  private colorOnHideLine(type: NumericalFeatures) {
    if (type === NumericalFeatures.MAX || type === NumericalFeatures.MIN) {
      return LineColor[type];
    } else {
      return StoryboardColors.LightGrey1;
    }
  }

  private opacityOnHideLine(type: NumericalFeatures) {
    if (type === NumericalFeatures.MAX || type === NumericalFeatures.MIN) {
      return 1;
    } else {
      return 0.3;
    }
  }

  private midXCoordinate(): number {
    const dateScale = this.xScaleMap.get("date");
    const mid =
      (dateScale(this.data[this.data.length - 1].date) +
        dateScale(this.data[0].date)) *
      0.5;

    return mid;
  }

  private coordinateOnAxis(date: Date): Coordinate {
    const data = this.data[findIndexOfDate(this.data, date)];
    console.log("data: ", data);
    const xScale = this.xScaleMap.get(this.selectedAxis);
    const x = xScale(data[this.selectedAxis]);
    const y = this.yScale(this.selectedAxis);
    return [x, y];
  }

  private topLeftCoordinate(): Coordinate {
    return [this.margin.right + ANNO_X_POS, ANNO_Y_POS + this.margin.top / 2];
  }

  private topMidCoordinate(): Coordinate {
    return [this.midXCoordinate(), ANNO_Y_POS + this.margin.top / 2];
  }

  private topRightCoordinate(): Coordinate {
    return [this.width - this.margin.left - ANNO_X_POS, ANNO_Y_POS];
  }

  old() {
    //
    //
    //

    // Position annotations & hide them
    this._annotations.forEach((d, idx) => {
      // Try to get the graphAnnotation object if undefined set array elem to false
      const graphAnnotation: GraphAnnotation = d?.graphAnnotation;
      if (!graphAnnotation) {
        return;
      }

      if (d && graphAnnotation) {
        const xScale = this.xScaleMap.get(d.originAxis);
        const x = xScale(d.data[d.originAxis]);
        const y = this.yScale(d.originAxis);

        graphAnnotation.x(x);
        graphAnnotation.y(y);

        // If add to svg and set opacity to 0 (to hide it)
        graphAnnotation.id(`id-annotation-${idx}`).addTo(this.svg);
        graphAnnotation.hideAnnotation();

        // Save the coordinates in PCAnnotation object
        d.origin = [x, y];
        if (d.featureType === NumericalFeatureType.MIN) {
          d.destination = [this.margin.right + ANNO_X_POS, ANNO_Y_POS];
        } else if (
          d.featureType === NumericalFeatureType.CURRENT ||
          d.featureType === NumericalFeatureType.LAST
        ) {
          d.destination = [xAxisMid, ANNO_Y_POS];
        } else if (d.featureType === NumericalFeatureType.MAX) {
          d.destination = [
            this.width - this.margin.left - ANNO_X_POS,
            ANNO_Y_POS,
          ];
        }
      }
    });

    //
    //
    //
    const currIdx = this._animationCounter;
    const prevIdx = this._animationCounter - 1;
    const currAnn: PCPAnnotation = this._annotations[currIdx];
    const prevAnn: PCPAnnotation = this._annotations[prevIdx];

    // prettier-ignore
    // console.log("PCP: _animateForward: currAnnotation = ", currAnn);

    // Show current line & its dots
    this.showLine(currIdx);
    this.shotDots(currIdx);

    // Show the annotation and move it to its destination
    currAnn?.graphAnnotation?.showAnnotation(0);
    currAnn?.graphAnnotation?.updatePosAnimate(
      currAnn.destination[0],
      currAnn.destination[1]
    );

    // Hide previous line & its dots
    if (prevAnn?.featureType === NumericalFeatureType.CURRENT) {
      this.hideLine(prevIdx);
      this.hideDots(prevIdx);
    }

    // Check if there is any past MAX line exists
    if (currAnn?.featureType === NumericalFeatureType.MAX) {
      this._annotations.slice(0, currIdx).forEach((d, idx) => {
        if (d.featureType === NumericalFeatureType.MAX) {
          this.hideLine(idx);
          this.hideDots(idx);
        }
      });
    }

    // Check if there is any past MIN line exists
    if (currAnn?.featureType === NumericalFeatureType.MIN) {
      this._annotations.slice(0, currIdx).forEach((d, idx) => {
        if (d.featureType === NumericalFeatureType.MIN) {
          this.hideLine(idx);
          this.hideDots(idx);
        }
      });
    }

    this._animationCounter += 1;
  }
}
