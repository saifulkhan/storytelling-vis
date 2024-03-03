import * as d3 from "d3";
import { Color } from "../Colors";
import { NumericalFeatureType } from "../../../utils/storyboards/processing/NumericalFeatureType";

//
// Annotations used in parallel coordinate
//

// For PCP - ParallelCoordinatePlot
export interface PCPAnnotation {
  graphAnnotation?: GraphAnnotation | null;
  origin?: number[]; // x, y coordinate at key axis
  destination?: number[]; // x, y coordinate
  fadeout?: boolean;
  data?: number; //store data // TODO: use uscaledtarget?
  originAxis?: string; // the selected axis
  featureType?: NumericalFeatureType;
  lineColor?: string; // line highlight
  dotColor?: string; // dot highlight circle color
}

// For LCP - LearningCurvePlot
export interface LCPAnnotation {
  graphAnnotation?: GraphAnnotation;
  end?: number;
  start?: number;
  unscaledTarget?: [number, number];
  fadeout?: boolean;
  featureType?: NumericalFeatureType;
}

// For TSP - TimeSeriesPlot
export interface TSPAnnotation {
  graphAnnotation?: GraphAnnotation;
  end?: number;
  start?: number;
  date?: any; //TODO: Where is it used // move unscaled target here?
  fadeout?: boolean;
  featureType?: NumericalFeatureType;
  useData2?: boolean;
}

const CIRCLE_RADIUS = 10,
  CIRCLE_STROKE_COLOR = Color.DarkGrey,
  CIRCLE_OPACITY = 0.5,
  CIRCLE_STROKE_WIDTH = 2;

const DOT_RADIUS = 5,
  DOT_FILL_COLOR = Color.DarkGrey,
  DOT_OPACITY = 1;

export class GraphAnnotation {
  _id;
  _wrap = 150;
  _align = "start";
  _x;
  _y;
  _tx = 0;
  _ty = 0;

  _circle;
  _dot;

  _title;
  _titleText;
  _rect;
  _rectPadding;

  _label;
  _labelText;
  _labelColor;
  _titleColor = "Black";
  _backgroundColor = Color.WhiteGrey;
  _textNode;

  _connector;
  _showConnector = false;
  _connectorOptions: any;
  _connectorColor = Color.LightGrey1;

  node;
  _annoWidth: number;
  _annoHeight: number;

  unscaledTarget: [number, number | Date]; // TODO: move it out of here

  constructor(id = "") {
    this._id = id;

    this._rectPadding = 10;

    this._title = d3
      .create("svg")
      .append("text")
      .attr("font-weight", "bold")
      .node();
    this._label = d3.create("svg").append("text").node();
    this._textNode = d3
      .create("svg")
      .append("g")
      .attr("class", "graph-annotation-text")
      .attr("fill", this._titleColor)
      .node();
    this._textNode.append(this._title);
    this._textNode.append(this._label);

    this._rect = d3.create("svg").append("rect").node();

    this._circle = d3
      .create("svg")
      .append("circle")
      .attr("r", 0)
      .attr("stroke", "none")
      .attr("stroke-width", 0)
      .attr("opacity", 0)
      .attr("fill", "none")
      .node();

    this._dot = d3
      .create("svg")
      .append("circle")
      .attr("r", 0)
      .attr("stroke", "none")
      .attr("stroke-width", 0)
      .attr("opacity", 0)
      .attr("fill", "none")
      .node();

    this._connector = d3
      .create("svg")
      .append("line")
      .attr("class", "graph-annotation-connector")
      .attr("stroke", this._connectorColor)
      .node();

    this.node = d3
      .create("svg")
      .append("g")
      .attr("display", "none")
      .attr("id", id)
      .attr("class", "graph-annotation")
      .attr("font-size", "12px")
      .node();

    // Maintain the order
    this.node.appendChild(this._rect);
    this.node.appendChild(this._connector);
    this.node.appendChild(this._textNode);
    this.node.appendChild(this._circle);
    this.node.appendChild(this._dot);
  }

  /*****************************************************************************
   ** Setters
   *****************************************************************************/

  id(id) {
    this._id = id;
    this.node.setAttribute("id", id);
    return this;
  }

  title(title) {
    this._title.textContent = title;
    this._titleText = title;
    return this;
  }

  label(label) {
    this._label.textContent = label;
    this._labelText = label;
    return this;
  }

  labelColor(color: string) {
    this._labelColor = color;
    this._label.style.fill = this._labelColor;

    return this;
  }

  titleColor(color) {
    this._titleColor = color;
    this._textNode.style.fill = this._titleColor;

    return this;
  }

  fontSize(fontSize) {
    this.node.setAttribute("font-size", fontSize);
    return this;
  }

  backgroundColor(backgroundColor) {
    this._backgroundColor = backgroundColor;
    this._rect.style.fill = this._backgroundColor;
    return this;
  }

  connectorColor(color) {
    this._connector.style.stroke = color;
    return this;
  }

  circleAttr(
    radius = CIRCLE_RADIUS,
    strokeColor = CIRCLE_STROKE_COLOR,
    strokeWidth = CIRCLE_STROKE_WIDTH,
    opacity = CIRCLE_OPACITY,
  ) {
    d3.select(this._circle)
      .attr("r", radius)
      .attr("opacity", opacity)
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidth);
    return this;
  }

  dotAttr(
    radius = DOT_RADIUS,
    fillColor = DOT_FILL_COLOR,
    opacity = DOT_OPACITY,
  ) {
    d3.select(this._dot)
      .attr("r", radius)
      .attr("fill", fillColor)
      .attr("opacity", opacity);
    return this;
  }

  align(align) {
    this._align = align;
    this.node.setAttribute("text-anchor", align);
    return this;
  }

  wrap(wrap) {
    this._wrap = wrap;
    return this;
  }

  x(x) {
    this._x = x;
    return this;
  }

  y(y) {
    this._y = y;
    return this;
  }

  target(tx, ty, showConnector = true, connectorOptions = undefined) {
    this._tx = tx;
    this._ty = ty;
    this._showConnector = showConnector;
    this._connectorOptions = connectorOptions;
    return this;
  }

  /*****************************************************************************
   ** Public methods
   *****************************************************************************/

  addTo(svg) {
    d3.select(svg).append(() => this.node);

    if (this._labelText && this._titleText) {
      this._formatText();
      this._repositionAnnotation();
    }

    if (this._backgroundColor) {
      this._rect.style.fill = this._backgroundColor;
      this._rect.setAttribute("width", this._annoWidth + this._rectPadding);
      this._rect.setAttribute("height", this._annoHeight + this._rectPadding);
      this._rect.setAttribute("rx", 5);
    }

    if (!(this._tx == this._x && this._ty == this._y) && this._showConnector) {
      this._addConnector();
    }

    // Set circle & dot coordinate
    d3.select(this._circle).attr("cx", this._tx).attr("cy", this._ty);
    d3.select(this._dot).attr("cx", this._tx).attr("cy", this._ty);

    // Reveal annotation
    this.node.removeAttribute("display");
  }

  updatePos(x, y) {
    this._x = x;
    this._y = y;

    this._repositionAnnotation();
    if (!(this._tx == this._x && this._ty == this._y) && this._showConnector) {
      this._addConnector();
    }
  }

  /*****************************************************************************
   ** Private methods
   *****************************************************************************/

  _alignToX() {
    // Uses the width and alignment of text to calculate correct x values of tspan elements
    return (
      (this._annoWidth / 2) *
      (this._align.toLowerCase() == "middle"
        ? 1
        : this._align.toLowerCase() == "end"
        ? 2
        : 0)
    );
  }

  _correctTextAlignment(textElem, annoWidth?) {
    // Aligns tspan elements based on chosen alignment
    Array.from(textElem.children).forEach((tspan: any) =>
      tspan.setAttribute("x", this._alignToX()),
    );
  }

  _wrapText(textElem, text) {
    // SVG text is all in a single line - to wrap text we split rows into
    // individual <tspan> elements
    let words = text.split(" ");
    textElem.innerHTML = "";
    // Draw each word onto svg and save its width before removing
    let wordElem;
    words = words.map((word) => {
      wordElem = textElem.appendChild(
        d3.create("svg").append("tspan").text(word).node(),
      );

      const { width: wordWidth } = wordElem.getBoundingClientRect();
      textElem.removeChild(wordElem);
      return { word: word, width: wordWidth };
    });

    textElem.textContent = "";

    // Keep adding words to row until width exceeds span then create new row
    let currentWidth = 0;
    let rowString = [];
    let isLastWord, forceNewLine;
    let rowNumber = 0;

    words.forEach((word, i) => {
      // Don't factor in the width taken up by spaces atm
      if (currentWidth + word.width < this._wrap) {
        currentWidth += word.width;
        rowString.push(word.word);
      } else {
        textElem.appendChild(
          d3
            .create("svg")
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1.1em")
            .text(rowString.join(" ") + " ")
            .node(),
        );
        currentWidth = word.width;
        rowString = [word.word];
        rowNumber++;
      }

      isLastWord = i == words.length - 1;
      if (isLastWord) {
        textElem.appendChild(
          d3
            .create("svg")
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1.1em")
            .text(rowString.join(" ") + " ")
            .node(),
        );
        rowNumber++;
      }
    });

    const rowHeight = textElem.getBoundingClientRect().height / rowNumber;
    return rowHeight;
  }

  _formatText() {
    const rowHeight = this._wrapText(this._title, this._titleText);
    this._wrapText(this._label, this._labelText);

    // Calculate spacing between title and label
    const { height: titleHeight } = this._title.getBoundingClientRect();
    const titleSpacing = titleHeight + rowHeight * 0.2;
    this._label.setAttribute("y", titleSpacing);
  }

  _repositionAnnotation() {
    const { width: annoWidth, height: annoHeight } =
      this._textNode.getBoundingClientRect();

    this._annoWidth = annoWidth;
    this._annoHeight = annoHeight;

    let rectX = this._x - (annoWidth + this._rectPadding) / 2;
    let textX = this._x - annoWidth / 2;

    if (this._connectorOptions && this._connectorOptions.left) {
      rectX -= (annoWidth + this._rectPadding) / 2;
      textX -= annoWidth / 2 + this._rectPadding / 2;
    } else if (this._connectorOptions && this._connectorOptions.right) {
      rectX += (annoWidth + this._rectPadding) / 2;
      textX += annoWidth / 2 + this._rectPadding / 2;
    }

    this._rect.setAttribute(
      "transform",
      `translate(${rectX},${this._y - (annoHeight + this._rectPadding) / 2})`,
    );

    // Translate x,y position to center of anno (rather than top left)
    this._textNode.setAttribute(
      "transform",
      `translate(${textX},${this._y - annoHeight / 2})`,
    );

    // Align text correctly
    this._correctTextAlignment(this._title);
    this._correctTextAlignment(this._label);
  }

  _addConnector() {
    let ix, iy;

    if (this._connectorOptions) {
      iy = this._y - this._annoHeight / 2;
      ix = this._x;
    } else {
      const dy = this._y - this._ty;
      const dx = this._x - this._tx;

      const above = dy > 0;
      const left = dx > 0;

      if (dy == 0) {
        iy = this._y;
        // @ts-expect-error -- investigate
        ix = this._x + (-1) ** left * (this._annoWidth / 2);
      }

      if (dx == 0) {
        ix = this._x;
        // @ts-expect-error -- investigate
        iy = this._y + (-1) ** above * (this._annoHeight / 2);
      }

      if (dx !== 0 && dy !== 0) {
        const rectGrad = this._annoHeight / this._annoWidth;
        const lineGrad = dy / dx;
        const c = this._y - lineGrad * this._x;

        const hIntersect =
          (lineGrad >= rectGrad && lineGrad >= -rectGrad) ||
          (lineGrad <= rectGrad && lineGrad <= -rectGrad);

        if (hIntersect) {
          // @ts-expect-error -- investigate
          iy = this._y + (-1) ** above * (this._annoHeight / 2);
          ix = (iy - c) / lineGrad;
        } else {
          // @ts-expect-error -- investigate
          ix = this._x + (-1) ** left * (this._annoWidth / 2);
          iy = lineGrad * ix + c;
        }
      }
    }

    this._connector.setAttribute("x1", ix);
    this._connector.setAttribute("x2", this._tx);
    this._connector.setAttribute("y1", iy);
    this._connector.setAttribute("y2", this._ty);

    this._connector.setAttribute("stroke", this._connectorColor);
  }

  /*********************************************************************************************************
   ** Animation used in TSP
   *********************************************************************************************************/

  /**
   ** Show all elements
   **/
  public showAnnotation(delay) {
    d3.select(this.node)
      .transition()
      .delay(delay)
      .duration(0)
      .style("opacity", 1);
    return delay;
  }

  /**
   ** Hide all elements
   **/
  public hideAnnotation() {
    d3.select(this.node).transition().delay(0).duration(0).style("opacity", 0);

    return 0;
  }

  /**
   ** Hide only message, box and connector
   */
  public hideMessage() {
    d3.select(this._rect).transition().delay(0).duration(0).style("opacity", 0);

    d3.select(this._textNode)
      .transition()
      .delay(0)
      .duration(0)
      .style("opacity", 0);

    d3.select(this._connector)
      .transition()
      .delay(0)
      .duration(0)
      .style("opacity", 0);

    return 0;
  }

  /**
   ** Hide only circle
   */
  public hideCircle() {
    d3.select(this._circle)
      .transition()
      .delay(0)
      .duration(0)
      .style("opacity", 0);

    return 0;
  }

  /*********************************************************************************************************
   ** Animation used in PCP
   *********************************************************************************************************/

  updatePosAnimate(x, y) {
    this._x = x;
    this._y = y;

    this._repositionAnnotationAnimate();
  }

  _repositionAnnotationAnimate() {
    const { width: annoWidth, height: annoHeight } =
      this._textNode.getBoundingClientRect();

    this._annoWidth = annoWidth;
    this._annoHeight = annoHeight;

    let rectX = this._x - (annoWidth + this._rectPadding) / 2;
    let textX = this._x - annoWidth / 2;

    if (this._connectorOptions && this._connectorOptions.left) {
      rectX -= (annoWidth + this._rectPadding) / 2;
      textX -= annoWidth / 2 + this._rectPadding / 2;
    } else if (this._connectorOptions && this._connectorOptions.right) {
      rectX += (annoWidth + this._rectPadding) / 2;
      textX += annoWidth / 2 + this._rectPadding / 2;
    }

    d3.select(this._circle)
      .transition()
      .ease(d3.easeQuadIn)
      .duration(1500)
      .attr("opacity", 0);

    d3.select(this._rect)
      .transition()
      .ease(d3.easeQuadIn)
      .duration(1500)
      .attr(
        "transform",
        `translate(${rectX},${this._y - (annoHeight + this._rectPadding) / 2})`,
      );

    d3.select(this._textNode)
      .transition()
      .ease(d3.easeQuadIn)
      .duration(1500)
      .attr("transform", `translate(${textX},${this._y - annoHeight / 2})`);

    // Align text correctly
    this._correctTextAlignment(this._title);
    this._correctTextAlignment(this._label);
  }
}
