import * as d3 from "d3";
import { Plot, PlotProps, defaultPlotProps } from "./Plot";
import { Coordinate } from "src/types/coordinate";

// Define the AnimationType type if it's not available from the original import
type AnimationType = "beginning" | "back" | "play" | "pause";

// Define a simplified TSPAnnotation type if it's not available from the original import
type TSPAnnotation = {
  start: number;
  end: number;
  text?: string;
};

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
  // Handle empty data case
  if (!data || data.length === 0) {
    return d3
      .scaleTime()
      .domain([new Date(), new Date()])
      .nice()
      .range([m.left, w - m.right]);
  }
  
  const extent = d3.extent(data, (d: MirroredBarChartData) => d.date) as [Date, Date];
  const xScale = d3
    .scaleTime()
    .domain(extent)
    .nice()
    .range([m.left, w - m.right]);
  return xScale;
};

const yScale1 = (data: MirroredBarChartData[], h = HEIGHT, m = MARGIN) => {
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d: MirroredBarChartData) => d.mean_test_accuracy) || 1,
    ])
    .nice()
    .range([(h - m.top - m.bottom) / 2, m.top]);
  return yScale;
};

const yScale2 = (data: MirroredBarChartData[], h = HEIGHT, m = MARGIN) => {
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d: MirroredBarChartData) => d.y) || 1])
    .nice()
    .range([(h - m.bottom - m.top) / 2, h - m.bottom]);
  return yScale;
};

export class MirroredBarChart extends Plot {
  _selector: string;
  // We use _svgElement to store the SVG element to avoid conflict with base class svg property
  _svgElement: SVGSVGElement | undefined;
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
  plotProps: PlotProps = { ...defaultPlotProps };

  _xScale: any;
  _yScale1: any;
  _yScale2: any;

  _lpAnnotations: TSPAnnotation[] = [];
  _annoTop = false;
  _animationCounter = 0;

  _barElements: any[] = [];

  constructor() {
    super();
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

    this._svgElement = d3
      .select(this._selector)
      .append("svg")
      .attr("width", this._width)
      .attr("height", this._height)
      // .style("background-color", "pink") // debug
      .node() as SVGSVGElement; // Type assertion to fix null vs undefined issue

    return this;
  }
  
  /**
   * Implementation of abstract method from Plot class
   */
  public setData(data: MirroredBarChartData[]) {
    this._data = data;
    return this;
  }

  /**
   * Implementation of abstract method from Plot class
   */
  public setPlotProps(props: PlotProps) {
    this.plotProps = { ...defaultPlotProps, ...props };
    this._title = this.plotProps.title || "";
    this._margin = this.plotProps.margin || MARGIN;
    return this;
  }

  /**
   * Implementation of abstract method from Plot class
   */
  public setName(name: string) {
    this._title = name;
    return this;
  }

  /**
   * Implementation of abstract method from Plot class
   */
  public setActions(lpAnnotations: TSPAnnotation[]) {
    this._lpAnnotations = lpAnnotations;
    this._animationCounter = 0;
    return this;
  }

  /**
   * Implementation of abstract method from Plot class
   */
  public getCoordinates(date: Date): [Coordinate, Coordinate] {
    // Find the data point for the given date
    const dataPoint = this._data.find(d => d.date.getTime() === date.getTime());
    if (!dataPoint) {
      return [[0, 0], [0, 0]];
    }
    
    const x = this._xScale(date);
    const y1 = this._yScale1(dataPoint.mean_test_accuracy || 0);
    const y2 = this._yScale2(dataPoint.y || 0);
    
    return [[x, y1], [x, y2]];
  }

  /**
   * Implementation of abstract method from Plot class
   */
  public setCanvas(svg: SVGSVGElement) {
    this._svgElement = svg;
    // Update the base class property using type assertion to avoid TypeScript errors
    (this as any).svg = svg;

    const bounds = svg.getBoundingClientRect();
    this._height = bounds.height;
    this._width = bounds.width;

    return this;
  }

  /**
   * The svg canvas is passed as an argument.
   * @deprecated Use setCanvas instead
   */
  // This method is needed for backward compatibility with existing code
  // We use @ts-ignore to suppress the TypeScript error about property vs method conflict
  // @ts-ignore
  svg(svg: SVGSVGElement) {
    return this.setCanvas(svg);
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
    this._clearSvg(); // Clear any existing elements first
    this._drawAxisAndLabels();

    if (this._lpAnnotations && this._lpAnnotations.length > 0) {
      this._createBars();

      // Show all bars
      this._barElements.forEach((barElement) => {
        if (barElement) barElement.style("opacity", 1);
      });
    } else {
      // If no annotations, create bars for all data points
      this._createBarsForAllData();
    }

    return this;
  }

  /**
   * Override the animate method from the Plot class
   * This method follows the LinePlot animation approach
   */
  animate(): void {
    const loop = async () => {
      if (!this.isPlayingRef.current || this._animationCounter >= this._lpAnnotations?.length) {
        return;
      }

      // Get the current annotation
      const annotation = this._lpAnnotations[this._animationCounter];
      
      // Animate the bars based on the annotation
      await this._animateWithTransition(annotation);
      
      // Increment the counter
      this._animationCounter++;
      
      // Continue the animation loop
      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }
  
  /**
   * New animation method that uses transitions like LinePlot
   */
  _animateWithTransition(annotation: TSPAnnotation): Promise<number> {
    if (!annotation || !this._data || this._data.length === 0) {
      return Promise.resolve(0);
    }
    
    // Get the data point for this annotation
    const dataIdx = annotation.end;
    const point = this._data[dataIdx];
    
    if (!point) {
      return Promise.resolve(0);
    }
    
    // Remove any existing annotation text
    if (this._svgElement) {
      d3.select(this._svgElement).selectAll(".annotation-text").remove();
    }
    
    // Create a bar element for this data point
    const barElement = this._svgElement ? d3.select(this._svgElement).append("g").style("opacity", 0) : null;
    if (!barElement) {
      return Promise.resolve(0);
    }
    
    // Top bar (test accuracy)
    if (point.mean_test_accuracy !== undefined) {
      const y1 = this._yScale1(point.mean_test_accuracy);
      const height1 = this._yScale1(0) - y1;
      
      barElement
        .append("rect")
        .attr("x", this._xScale(point.date) - BAR_WIDTH / 2)
        .attr("y", y1)
        .attr("width", BAR_WIDTH)
        .attr("height", Math.abs(height1))
        .attr("fill", this._color1);
    }
    
    // Bottom bar (parameter value)
    if (point.y !== undefined) {
      const midPoint = (this._height - this._margin.top - this._margin.bottom) / 2 + this._margin.top;
      const y2 = midPoint;
      const height2 = this._yScale2(point.y) - this._yScale2(0);
      
      barElement
        .append("rect")
        .attr("x", this._xScale(point.date) - BAR_WIDTH / 2)
        .attr("y", y2)
        .attr("width", BAR_WIDTH)
        .attr("height", Math.max(0, height2))
        .attr("fill", this._color2);
    }
    
    // Add annotation text if available
    if (annotation.text) {
      const x = this._xScale(point.date);
      const y = this._yScale1(point.mean_test_accuracy || 0) - 10;
      
      barElement
        .append("text")
        .attr("class", "annotation-text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", this._color1)
        .text(annotation.text || "");
    }
    
    // Animate the bar with a transition
    return new Promise<number>((resolve) => {
      const duration = 800;
      
      barElement
        .transition()
        .duration(duration)
        .style("opacity", 1)
        .on("end", () => {
          resolve(duration);
        });
    });
  }

  /**
   * Animate the chart based on the animation type
   */
  animateWithType(animationType: AnimationType) {
    console.log("MirroredBarChart: animate: animationType = ", animationType);
    
    // Create bars if they don't exist yet
    if (this._barElements.length === 0) {
      if (this._lpAnnotations && this._lpAnnotations.length > 0) {
        this._createBars();
      } else {
        this._createBarsForAllData();
        return; // No animation needed if we're showing all data
      }
    }

    if (!this._lpAnnotations || this._lpAnnotations.length === 0) {
      console.warn("MirroredBarChart: animate: No annotations to animate");
      return;
    }

    if (animationType === "beginning") {
      this._animateBeginning();
      this._animationCounter = 0;
    } else if (animationType === "back" && this._animationCounter > 0) {
      this._animateBack();
      this._animationCounter -= 1;
    } else if (animationType === "play") {
      // If we're at the end, start from the beginning
      if (this._animationCounter >= this._lpAnnotations.length) {
        this._animateBeginning();
        this._animationCounter = 0;
      }
      // Start the animation loop
      this.animate();
    } else if (animationType === "pause") {
      // Pause handled by the parent class
      if (this.animationRef) {
        cancelAnimationFrame(this.animationRef);
      }
    }

    console.log("MirroredBarChart: animate: _animationCounter: ", this._animationCounter);
  }

  /**************************************************************************************************************
   * Private methods
   **************************************************************************************************************/

  // Create bars based on annotations
  _createBars() {
    if (!this._lpAnnotations || !this._data || this._data.length === 0) {
      console.warn("MirroredBarChart: _createBars: No annotations or data available");
      this._barElements = [];
      return;
    }

    this._barElements = this._lpAnnotations.map((d: TSPAnnotation) => {
      console.log("MirroredBarChart: _createBars: annotation, d = ", d);
      
      // Make sure we have a valid index
      const index = Math.min(d.end, this._data.length - 1);
      const point = this._data[index];
      
      if (!point) {
        console.warn(`MirroredBarChart: _createBars: No data point at index ${index}`);
        return null;
      }

      // Create a group element for the bars
      if (!this._svgElement) return null;
      const barElement = d3.select(this._svgElement as any).append("g").style("opacity", 0);

      // Top bar (test accuracy)
      if (point.mean_test_accuracy !== undefined) {
        const y1 = this._yScale1(point.mean_test_accuracy);
        const height1 = this._yScale1(0) - y1;
        
        barElement
          .append("rect")
          .attr("x", this._xScale(point.date) - BAR_WIDTH / 2)
          .attr("y", y1)
          .attr("width", BAR_WIDTH)
          .attr("height", Math.max(0, height1))
          .attr("fill", this._color1);
      }

      // Bottom bar (y value)
      if (point.y !== undefined) {
        const midPoint = (this._height - this._margin.top - this._margin.bottom) / 2 + this._margin.top;
        const y2 = midPoint;
        const height2 = this._yScale2(point.y) - this._yScale2(0);
        
        barElement
          .append("rect")
          .attr("x", this._xScale(point.date) - BAR_WIDTH / 2)
          .attr("y", y2)
          .attr("width", BAR_WIDTH)
          .attr("height", Math.max(0, height2))
          .attr("fill", this._color2);
      }

      return barElement;
    }).filter(Boolean); // Remove any null elements

    console.log("MirroredBarChart: _createBars: _barElements: ", this._barElements);
  }

  /**
   * Reset the animation to the beginning state
   */
  _animateBeginning() {
    console.log(`MirroredBarChart: _animateBeginning`);

    // Remove any annotation text
    if (this._svgElement) {
      d3.select(this._svgElement).selectAll(".annotation-text").remove();
    }

    // Hide all bars with a transition
    this._barElements.forEach((element) => {
      if (element) {
        element
          .transition()
          .duration(300)
          .style("opacity", 0.3);
      }
    });

    return;
  }

  /**
   * Animate backward by hiding the current bar and showing the previous one
   */
  _animateBack() {
    if (!this._lpAnnotations || this._lpAnnotations.length === 0) return;
    
    // Get current and previous indices
    const currentIndex = this._animationCounter;
    const previousIndex = Math.max(0, currentIndex - 1);
    
    console.log(`MirroredBarChart: _animateBack: ${previousIndex} <- ${currentIndex}`);

    // Remove any annotation text
    if (this._svgElement) {
      d3.select(this._svgElement).selectAll(".annotation-text").remove();
    }

    // Hide current bar
    const currentBar = this._barElements[currentIndex];
    if (currentBar) {
      currentBar
        .transition()
        .duration(300)
        .style("opacity", 0.3);
    }

    // Show previous bar
    const previousBar = this._barElements[previousIndex];
    if (previousBar) {
      previousBar
        .transition()
        .duration(500)
        .style("opacity", 1)
        .on("end", () => {
          // Add annotation text if available
          if (this._lpAnnotations[previousIndex]?.text) {
            const annotation = this._lpAnnotations[previousIndex];
            const point = this._data[Math.min(annotation.end, this._data.length - 1)];
            if (point) {
              const x = this._xScale(point.date);
              const y = this._yScale1(point.mean_test_accuracy || 0) - 10;
              
              if (this._svgElement) {
                d3.select(this._svgElement)
                  .append("text")
                  .attr("class", "annotation-text")
                  .attr("x", x)
                  .attr("y", y)
                  .attr("text-anchor", "middle")
                  .style("font-size", "12px")
                  .style("fill", this._color1)
                  .text(annotation.text || "")
                  .style("opacity", 0)
                  .transition()
                  .duration(300)
                  .style("opacity", 1);
              }
            }
          }
        });
    }
  }

  /**
   * Animate forward by showing the next bar element
   */
  _animateForward() {
    if (!this._lpAnnotations || this._lpAnnotations.length === 0) return;
    
    // Number of bar elements
    const barCount = this._barElements.length;
    if (barCount === 0) return;
    
    // Get current index (with bounds checking)
    const currIdx = Math.min(this._animationCounter, barCount - 1);
    
    console.log(`MirroredBarChart: _animateForward: currIdx = ${currIdx}`);

    const currBarElement = this._barElements[currIdx];
    if (!currBarElement) return;

    // Hide all other elements first
    this._barElements.forEach((element, idx) => {
      if (idx !== currIdx && element) {
        element.style("opacity", 0.3); // Make others semi-transparent
      }
    });

    // Show current element with transition
    currBarElement
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .style("opacity", 1)
      .on("end", () => {
        // Add annotation text if available
        if (this._lpAnnotations[currIdx]?.text) {
          const annotation = this._lpAnnotations[currIdx];
          const point = this._data[Math.min(annotation.end, this._data.length - 1)];
          if (point) {
            const x = this._xScale(point.date);
            const y = this._yScale1(point.mean_test_accuracy || 0) - 10;
            
            if (this._svgElement) {
              d3.select(this._svgElement)
                .append("text")
                .attr("class", "annotation-text")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", this._color1)
                .text(annotation.text || "")
                .style("opacity", 0)
                .transition()
                .duration(300)
                .style("opacity", 1);
            }
          }
        }
      });
  }

  // Create bars for all data points when no annotations are provided
  _createBarsForAllData() {
    if (!this._data || this._data.length === 0) return;
    
    this._barElements = this._data.map((point, index) => {
      if (!point) return null;
      
      const barElement = this._svgElement ? d3.select(this._svgElement as any).append("g").style("opacity", 1) : null;
      
      // If barElement is null, skip this iteration
      if (!barElement) return null;

      // Top bar (test accuracy)
      if (point.mean_test_accuracy !== undefined) {
        const y1 = this._yScale1(point.mean_test_accuracy);
        const height1 = this._yScale1(0) - y1;
        
        barElement
          .append("rect")
          .attr("x", this._xScale(point.date) - BAR_WIDTH / 2)
          .attr("y", y1)
          .attr("width", BAR_WIDTH)
          .attr("height", Math.max(0, height1))
          .attr("fill", this._color1);
      }

      // Bottom bar (y value)
      if (point.y !== undefined) {
        const midPoint = (this._height - this._margin.top - this._margin.bottom) / 2 + this._margin.top;
        const y2 = midPoint;
        const height2 = this._yScale2(point.y) - this._yScale2(0);
        
        barElement
          .append("rect")
          .attr("x", this._xScale(point.date) - BAR_WIDTH / 2)
          .attr("y", y2)
          .attr("width", BAR_WIDTH)
          .attr("height", Math.max(0, height2))
          .attr("fill", this._color2);
      }

      return barElement;
    }).filter(Boolean) as any[]; // Remove any null elements and cast to any[] to avoid TypeScript errors
  }

  /**
   * Create axes and add labels
   */
  _drawAxisAndLabels() {
    console.log(`MirroredBarChart:_drawAxisAndLabels:`);
    console.log("MirroredBarChart:_drawAxisAndLabels: data1 = ", this._data);

    if (!this._data || this._data.length === 0) {
      console.warn("MirroredBarChart:_drawAxisAndLabels: No data available");
      return this;
    }

    this._xScale = xScale(this._data, this._width, this._margin);
    this._yScale1 = yScale1(this._data, this._height, this._margin);
    this._yScale2 = yScale2(this._data, this._height, this._margin);

    // Clear axes and labels
    if (this._svgElement) {
      d3.select(this._svgElement).selectAll("#id-axes-labels").remove();
    }

    // Handle the case where _svgElement might be undefined
    if (!this._svgElement) return this;
    
    const selection = d3
      .select(this._svgElement as any) // Type assertion to avoid d3 selection errors
      .append("g")
      .attr("id", "id-axes-labels");

    // Add title if provided
    if (this._title) {
      selection
        .append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .attr("x", this._width / 2)
        .attr("y", this._margin.top / 2)
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(this._title);
    }

    // Create the X-axis in middle
    const xAxis = d3.axisBottom(this._xScale);
    this._ticks && xAxis.ticks(this._ticks);
    selection
      .append("g")
      .attr(
        "transform",
        `translate(0, ${(this._height - this._margin.top - this._margin.bottom) / 2 + this._margin.top})`
      )
      .call(xAxis)
      .style("font-size", FONT_SIZE)
      // label
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this._width / 2)
      .attr("y", 35)
      .text(this._xLabel)
      .style("font-size", YAXIS_LABEL_FONT_SIZE);

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
      if (typeof d === 'number') {
        let prefix = d3.formatPrefix(".0", d);
        return prefix(d);
      }
      return d.toString();
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

    // Add a horizontal line in the middle to separate the two charts
    selection
      .append("line")
      .attr("x1", this._margin.left)
      .attr("y1", (this._height - this._margin.top - this._margin.bottom) / 2 + this._margin.top)
      .attr("x2", this._width - this._margin.right)
      .attr("y2", (this._height - this._margin.top - this._margin.bottom) / 2 + this._margin.top)
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "5,5");

    return this;
  }

  /**
   * Select all elements below svg with the selector "svg > *" and remove.
   * Otherwise it will keep drawing on top of the previous lines / scales.
   */
  _clearSvg() {
    if (this._svgElement) {
      d3.select(this._svgElement).selectAll("svg > *").remove();
    }
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

  /**
   * Play animation - moves forward through the animation
   */
  /**
   * Override the play method from the Plot class
   */
  play() {
    super.play();
    this.animateWithType("play");
    return this;
  }

  /**
   * Override the pause method from the Plot class
   */
  pause() {
    super.pause();
    this.animateWithType("pause");
    return this;
  }

  /**
   * Override the togglePlayPause method from the Plot class
   */
  togglePlayPause() {
    super.togglePlayPause();
    
    // If we're currently animating, pause; otherwise play
    if (this._animationCounter > 0) {
      this.pause();
    } else {
      this.play();
    }
    return this;
  }
}
