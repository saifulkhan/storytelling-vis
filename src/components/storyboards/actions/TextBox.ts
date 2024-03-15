import * as d3 from "d3";
import { Action, Coordinate } from "./Action";
import { Actions } from "./Actions";
import { HorizontalAlign, VerticalAlign } from "../../../types/Align";

export type TextBoxProperties = {
  id?: string;
  title?: string;
  message?: string;
  backgroundColor?: string;
  width?: number;
  showConnector?: boolean;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
};

export const defaultTextBoxProperties: TextBoxProperties = {
  id: "TextBox",
  title: "...T...",
  message: "...M...",
  backgroundColor: "#F8F8F8",
  width: 300,
  showConnector: false,
  horizontalAlign: "middle",
  verticalAlign: "middle",
};

const PADDING = 3;
const FONT_FAMILY = "Arial Narrow";
const FONT_SIZE = "12px";

export class TextBox extends Action {
  protected _properties: TextBoxProperties;
  protected _rectNode: SVGRectElement;
  protected _titleNode: SVGTextElement;
  protected _messageNode: SVGTextElement;
  protected _textNode: SVGGElement;
  protected _connectorNode: SVGAElement;
  protected _spaceWidth;

  constructor() {
    super();
    this._type = Actions.TEXT_BOX;
  }

  public properties(properties: TextBoxProperties = {}) {
    this._properties = { ...defaultTextBoxProperties, ...properties };
    return this;
  }

  public templateProperties(extra: any) {
    this._properties.message = this.updateStringTemplate(
      this._properties.message,
      extra
    );
    this._properties.title = this.updateStringTemplate(
      this._properties.title,
      extra
    );

    this._properties.align = extra.align;
    return this;
  }

  public draw() {
    this._rectNode = d3
      .create("svg")
      .append("rect")
      .attr("fill", this._properties.backgroundColor)
      .attr("width", this._properties.width)
      .attr("rx", 3)
      .node();
    this._node.appendChild(this._rectNode);

    this._titleNode = d3
      .create("svg")
      .append("text")
      .attr("font-size", FONT_SIZE)
      .attr("font-family", FONT_FAMILY)
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .node();

    this._messageNode = d3
      .create("svg")
      .append("text")
      .attr("font-size", FONT_SIZE)
      .attr("font-family", FONT_FAMILY)
      .attr("fill", "black")
      .node();

    this._textNode = d3
      .create("svg")
      .append("g")
      .attr("fill", this._properties.backgroundColor)
      .node();

    this._connectorNode = d3
      .create("svg")
      .append("line")
      .attr("stroke", "#808080")
      .attr("opacity", 1)
      .style("stroke-dasharray", "3,3")
      .node();

    this._textNode.append(this._titleNode);
    this._textNode.append(this._messageNode);
    this._node.appendChild(this._textNode);
    this._node.appendChild(this._connectorNode);

    // wrap title and message
    this.wrap(this._titleNode, this._properties.title);
    this.wrap(this._messageNode, this._properties.message);

    // y position of message, give some space after title
    let height = this._titleNode.getBoundingClientRect().height;
    this._messageNode.setAttribute("y", `${height + PADDING}px`);

    // y position of rect
    height = this._textNode.getBoundingClientRect().height;
    this._rectNode.setAttribute("height", `${height + PADDING}px`);

    return this;
  }

  /*
   * In SVG, text is rendered in a single line. To wrap text, we use individual
   * <tspan> elements for each row.
   */
  private wrap(element: SVGTextElement, text: string) {
    const words: string[] = text.split(" ");
    // console.log("TextBox:_wrap words =", words);

    const calculateTextWidth = (
      element: SVGTextElement,
      word: string
    ): number => {
      const wordElem = element.appendChild(
        d3.create("svg").append("tspan").text(word).node()
      );

      // console.log("TextBox:_wrap wordElem =", wordElem);
      // wordElem = <tspan>​{DATE},​</tspan>​

      const { width } = wordElem.getBoundingClientRect();
      element.removeChild(wordElem);
      return width;
    };

    const addText = (element: SVGTextElement, words: string[]) => {
      element.appendChild(
        d3
          .create("svg")
          .append("tspan")
          .attr("x", 0)
          .attr("dy", "1.1em")
          .text(words.join(" ") + " ")
          .node()
      );
    };

    // Draw each word onto svg and save its width before removing
    const wordWidthArr: { word: string; width: number }[] = words.map(
      (word) => {
        return { word: word, width: calculateTextWidth(element, word) };
      }
    );
    // console.log("TextBox:_wrap wordWidthArr =", wordWidthArr);

    // calculate the width of the backspace text
    this._spaceWidth = calculateTextWidth(element, "-");
    // console.log("TextBox:_wrap _spaceWidth = ", this._spaceWidth);

    // keep adding words to row until width exceeds span then create new row
    let accumulatedWidth = 0;
    let wordsInLine = [];
    const messageWidth = this._properties.width - PADDING;

    for (let i = 0; i < wordWidthArr.length; i++) {
      const word = wordWidthArr[i].word,
        width = wordWidthArr[i].width + this._spaceWidth;

      if (accumulatedWidth + width < messageWidth) {
        // prettier-ignore
        // console.log("TextBox:_wrap wordsInLine = ", wordsInLine, ", accumulatedWidth + width = ", accumulatedWidth + width, "this._messageWidth = ", this._messageWidth)
        // keep adding words to be displayed in a line
        accumulatedWidth += width;
        wordsInLine.push(word);
      } else {
        // create a line
        addText(element, wordsInLine);

        // prepare for new line
        accumulatedWidth = width;
        wordsInLine = [word];
      }

      // last word
      if (i === wordWidthArr.length - 1) {
        addText(element, wordsInLine);
      }
    }
  }

  public coordinate(src: Coordinate, dest: Coordinate) {
    this._src = src;
    this._dest = dest;
    const [x1, y1] = this._src;
    const [x2, y2] = this._dest;

    const { width, height } = this._rectNode.getBoundingClientRect();
    let x = 0,
      y = 0;

    if (this._properties.horizontalAlign === "left") {
      x = this._dest[0] - width;
    } else if (this._properties.horizontalAlign === "middle") {
      x = this._dest[0] - width / 2;
    } else if (this._properties.horizontalAlign === "right") {
      x = this._dest[0];
    }

    if (this._properties.verticalAlign === "top") {
      y = this._dest[1] - height;
    } else if (this._properties.verticalAlign === "middle") {
      y = this._dest[1] - height / 2;
    } else if (this._properties.verticalAlign === "bottom") {
      y = this._dest[1] + height;
    }

    d3.select(this._rectNode).attr("transform", `translate(${x},${y})`);
    d3.select(this._textNode).attr(
      "transform",
      `translate(${x + PADDING},${y})`
    );

    // align texts
    this.correctTextAlignment(this._titleNode, width, "middle");
    this.correctTextAlignment(this._messageNode, width);

    // connector
    if (this._properties.showConnector) {
      d3.select(this._connectorNode)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    }

    return this;
  }

  public move(dest: Coordinate, delay = 0, duration = 1500) {
    const { width, height } = this._rectNode.getBoundingClientRect();

    // left align
    // const x = dest[0] - width;
    // center aligned
    // const x = dest[0] - width / 2;
    // right align
    const x = dest[0];
    const y = dest[1] - height;

    const promise1 = new Promise<number>((resolve, reject) => {
      d3.select(this._rectNode)
        .transition()
        .ease(d3.easeQuadIn)
        .duration(duration)
        .attr("transform", `translate(${x},${y})`)
        .on("end", () => {
          resolve(delay + duration);
        });
    });

    const promise2 = new Promise<number>((resolve, reject) => {
      d3.select(this._textNode)
        .transition()
        .ease(d3.easeQuadIn)
        .duration(duration)
        .attr("transform", `translate(${x + PADDING},${y})`)
        .on("end", () => {
          resolve(delay + duration);
        });
    });

    // align texts
    this.correctTextAlignment(this._titleNode, width, "middle");
    this.correctTextAlignment(this._messageNode, width);

    return Promise.all([promise1, promise2]);
  }

  private correctTextAlignment(textElem, width, align = undefined) {
    const alignToX = () => {
      // uses the width and alignment of text to calculate correct x values of
      // tspan elements
      return (width / 2) * (align == "middle" ? 1 : align == "end" ? 2 : 0);
    };

    // aligns tspan elements based on chosen alignment
    Array.from(textElem.children).forEach((tspan: any) =>
      tspan.setAttribute("x", alignToX())
    );
  }

  /**
   ** Define a function to replace variables in a string template
   **
   ** Example:
   ** const templateString = "Hello, ${name}! You are ${age} years old.";
   ** const variables = { name: "John Doe", age: 30 };
   ** const result = updateStringTemplate(templateString, variables);
   ** console.log(result); // Output: "Hello, John Doe! You are 30 years old."
   **/
  private updateStringTemplate(
    template: string,
    variables: { [key: string]: any }
  ): string {
    const variableRegex = /\${(\w+)}/g; // Regex to match variable placeholders

    return template.replace(variableRegex, (match, variableName) => {
      const value = variables[variableName];
      return value !== undefined ? value.toString() : match;
    });
  }
}
