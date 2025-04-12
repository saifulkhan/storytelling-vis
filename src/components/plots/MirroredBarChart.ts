import * as d3 from "d3";
import { TimeSeriesData, TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { Plot, PlotProps, defaultPlotProps } from "./Plot";
import { Colors } from "src/components/Colors";
import { TimelineMSBActions } from "src/types/TimelineMSBActions";
import { Coordinate } from "src/types/Coordinate";

export type MirroredBarChartProps = PlotProps & {
  fontSize?: string;
  yAxisLabelFontSize?: string;
  yAxisLabelOffset?: number;
  bar1Color?: string;
  bar2Color?: string;
  barWidth?: number;
  barXAxisGap?: number;
  xLabel?: string;
  y1Label?: string;
  y2Label?: string;
};

const ID_AXIS_SELECTION = "#id-axes-selection";

export class MirroredBarChart extends Plot {
  props: MirroredBarChartProps = {
    ...defaultPlotProps,
    margin: { top: 150, right: 50, bottom: 60, left: 60 },
    fontSize: "12px",
    yAxisLabelFontSize: "14px",
    yAxisLabelOffset: 10,
    bar1Color: Colors.CornflowerBlue,
    bar2Color: Colors.DarkGrey,
    barWidth: 3,
    barXAxisGap: 2,
    xLabel: "x axis",
    y1Label: "y1 axis",
    y2Label: "y2 axis",
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

  // Animation related properties
  barElements: any[] = [];
  isPlayingRef: { current: boolean } = { current: false };
  playActionIdx: number = 0;
  lastAction: any = null;
  animationRef: number = 0;

  constructor() {
    super();
  }

  public setPlotProps(props: PlotProps) {
    // Convert PlotProps to MirroredBarChartProps
    const convertedProps: Partial<MirroredBarChartProps> = {
      ...props,
      // Ensure ticks is properly handled (PlotProps has boolean, MirroredBarChartProps has number)
      ticks: props.ticks ? (this.props.ticks || 5) : 0
    };
    this.props = { ...this.props, ...convertedProps };
    return this;
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

    this._drawBarsAndHide();

    return this;
  }

  /**
   ** Draw bars and lines (no animation)
   **/
  plot() {
    console.log("plot: data:", this.data);
    this._drawAxis();

    // Add top bars (commented out for now)
    d3.select(this.svg)
      .selectAll(".bar-top")
      .data(this.data)
      .join("rect")
      .attr("class", "bar-top")
      .attr("x", (d) => this.xScale(d.date))
      .attr(
        "y",
        (d) => this.yScale1(d[this.props.y1Label]) - this.props.barXAxisGap
      )
      .attr("width", this.props.barWidth)
      .attr(
        "height",
        (d) => this.yScale1(0) - this.yScale1(d[this.props.y1Label])
      )
      .attr("fill", this.props.bar1Color);

    // Add bottom bars starting exactly from the middle point
    d3.select(this.svg)
      .selectAll(".bar-bottom")
      .data(this.data)
      .join("rect")
      .attr("class", "bar-bottom")
      .attr("x", (d) => this.xScale(d.date))
      .attr("y", this.height / 2) // Start exactly from the middle point
      .attr("width", this.props.barWidth)
      .attr(
        "height",
        (d) => this.yScale2(d[this.props.y2Label]) - this.yScale2(0)
      )
      .attr("fill", this.props.bar2Color);

    return this.svg;
  }

  /**
   * Create axes and add labels
   **/
  _drawAxis() {
    d3.select(this.svg).selectAll("#id-axes-labels").remove(); // TODO
    console.log("_drawAxis: data = ", this.data);

    const middlePoint = this.height / 2;

    this.xScale = d3
      .scaleTime()
      .domain(
        d3.extent(this.data, (d: TimeSeriesPoint) => d.date) as [Date, Date]
      )
      .nice()
      .range([this.margin.left, this.width - this.margin.right]);

    // adjust yScale1 to use top half of the available space
    this.yScale1 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.data, (d: TimeSeriesPoint) => {
          const value = d[this.props.y1Label as keyof typeof d];
          return typeof value === "number" ? value : 0;
        }) || 0,
      ])
      .nice()
      .range([
        middlePoint, // bottom of top half is exactly at the middle
        this.margin.top, // top of the chart
      ]);

    // adjust yScale2 to use bottom half of the available space
    this.yScale2 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.data, (d: TimeSeriesPoint) => {
          const value = d[this.props.y2Label as keyof typeof d];
          return typeof value === "number" ? value : 0;
        }) || 0,
      ])
      .nice()
      .range([
        middlePoint, // Top of bottom half is exactly at the middle
        this.height - this.margin.bottom, // bottom of the chart
      ]);

    const selection = d3
      .select(this.svg)
      .append("g")
      .attr("id", "id-axes-labels");

    // create the X-axis exactly in the middle
    const xAxis = d3.axisBottom(this.xScale);
    // TODO this.ticks && xAxis.ticks(this.ticks);

    selection
      .append("g")
      .attr(
        "transform",
        `translate(0, ${middlePoint})` // Position x-axis exactly at the middle point
      )
      .call(xAxis)
      .style("font-size", this.props.fontSize)
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this.width / 2)
      .attr("y", 30) // Adjust the position of the x-axis label
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
      .attr("x", -(middlePoint + this.margin.top) / 2) // center the label in the top half
      .attr("y", -this.margin.left + this.props.yAxisLabelOffset)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this.props.y1Label)
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
      .attr("x", -(middlePoint + this.height - this.margin.bottom) / 2) // Center the label in the bottom half
      .attr("y", -this.margin.left + this.props.yAxisLabelOffset)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this.props.y2Label)
      .style("font-size", this.props.yAxisLabelFontSize)
      .style("fill", "black");

    // Add a horizontal line at the middle to emphasize the split
    selection
      .append("line")
      .attr("x1", this.margin.left)
      .attr("y1", middlePoint)
      .attr("x2", this.width - this.margin.right)
      .attr("y2", middlePoint)
      .attr("stroke", this.props.bar1Color)
      .attr("stroke-width", 1);

    return this;
  }


  animate() {
    const loop = async () => {
      if (
        !this.isPlayingRef.current ||
        this.playActionIdx >= this.actions.length
      ) {
        return;
      }

      // TODO: this plot in not in sync with the line plot used in ML story

      // don't hide the previous action, but simulate the time it would take
      // simulate the time action.hide() would take with a delay
      if (this.lastAction) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // get the current action and its date
      const [date, action] = this.actions[this.playActionIdx];
      console.log("playActionIdx", this.playActionIdx, "length", this.actions.length);

      // find the index of the data point corresponding to this date
      const dataIdx = this.data.findIndex(
        (d) => d.date.getTime() === date.getTime()
      );
      if (dataIdx === -1) {
        console.error("Could not find data point for date:", date);
        this.playActionIdx++;
        this.animationRef = requestAnimationFrame(loop);
        return;
      }

      // animate the bars up to this data point
      await this._animateBars(this.startDataIdx, dataIdx);
      
      // don't show the action, but still wait for the same amount of time
      // that action.show() would take to keep animations in sync
      await new Promise(resolve => setTimeout(resolve, 500));

      // update state for next animation
      this.lastAction = action;
      this.startDataIdx = dataIdx;
      this.playActionIdx++;
      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  /**
   * Create all bars but keep them hidden initially
   * Each bar consists of a top and bottom part
   */
  _drawBarsAndHide() {
    // Clear any existing bar elements
    d3.select(this.svg).selectAll(".bar-container").remove();

    // Create container for all bars
    this.barElements = this.data.map((point, index) => {
      // Create a group for each bar pair (top and bottom)
      const barElement = d3
        .select(this.svg)
        .append("g")
        .attr("class", "bar-container")
        .attr("data-index", index.toString())
        .style("opacity", 0); // Initially hidden

      // Add top bar (if data exists)
      const y1Value = point[this.props.y1Label as keyof typeof point];
      if (typeof y1Value === "number") {
        barElement
          .append("rect")
          .attr("class", "bar-top")
          .attr("x", this.xScale(point.date))
          .attr("y", this.yScale1(y1Value))
          .attr("width", this.props.barWidth)
          .attr("height", this.yScale1(0) - this.yScale1(y1Value))
          .attr("fill", this.props.bar1Color);
      }

      // Add bottom bar (if data exists)
      const y2Value = point[this.props.y2Label as keyof typeof point];
      if (typeof y2Value === "number") {
        barElement
          .append("rect")
          .attr("class", "bar-bottom")
          .attr("x", this.xScale(point.date))
          .attr("y", this.height / 2) // Start from middle
          .attr("width", this.props.barWidth)
          .attr("height", this.yScale2(y2Value) - this.yScale2(0))
          .attr("fill", this.props.bar2Color);
      }

      return barElement;
    });

    console.log(
      "MirroredBarChart: _drawBarsAndHide: Created",
      this.barElements.length,
      "bar elements"
    );
    return this;
  }

  /**
   * Animate bars from start index to stop index
   * @param start Starting data index
   * @param stop Ending data index (inclusive)
   * @returns Promise that resolves when animation completes
   */
  public getCoordinates(...args: unknown[]): [Coordinate, Coordinate] {
    // If specific points are provided, use them
    if (args.length >= 2) {
      const x = args[0] as number;
      const y = args[1] as number;
      return [
        [x, y],
        [x, y]
      ];
    }
    
    // Otherwise return the bounds of the visualization area
    return [
      [this.margin.left, this.margin.top],
      [this.width - this.margin.right, this.height - this.margin.bottom]
    ];
  }

  private _animateBars(start: number, stop: number) {
    console.log(`_animateBars: animating from ${start} to ${stop}`);

    // calculate how many bars to show
    const barsToShow = this.barElements.slice(start, stop + 1);

    if (barsToShow.length === 0) {
      console.warn("No bars to animate in the specified range");
      return Promise.resolve();
    }

    // TODO: the animation time is not in sync with the line plot used in ML story

    // animation settings - match with LinePlot timing
    const delay = 1000; // same as LinePlot delay
    const baseDuration = 1000; // base duration for animation
    
    // instead of staggering, animate all bars together with a duration proportional to the number of bars
    // this better matches how the line is drawn in LinePlot
    const duration = Math.max(baseDuration, barsToShow.length * 100);
    
    // create a single promise for the entire bar animation
    return new Promise<number>((resolve) => {
      // animate all bars together
      barsToShow.forEach((barElement: d3.Selection<SVGGElement, unknown, null, undefined>) => {
        barElement
          .transition()
          .ease(d3.easeLinear) // same easing as LinePlot
          .delay(delay) // same delay as LinePlot
          .duration(duration)
          .style("opacity", 1);
      });
      
      // use the last bar to trigger the resolution
      if (barsToShow.length > 0) {
        barsToShow[barsToShow.length - 1]
          .transition()
          .ease(d3.easeLinear)
          .delay(delay)
          .duration(duration)
          .on("end", () => {
            console.log("All bar animations completed");
            resolve(delay + duration);
          });
      } else {
        resolve(0);
      }
    });
  }
}
