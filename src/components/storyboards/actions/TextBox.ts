import * as d3 from "d3";
import { AbstractAction, Coordinate } from "./AbstractAction";
import { ActionEnum } from "./ActionEnum";

export type TextBoxProperties = {
  id?: string;
  title?: string;
  message?: string;
  backgroundColor?: string;
  width?: number;
};

export const defaultTextBoxProperties: TextBoxProperties = {
  id: "TextBox",
  title: "Title ...",
  message: "Message text goes here ...",
  backgroundColor: "#E0E0E0",
  width: 300,
};

const PADDING = 3;
const FONT_FAMILY = "Arial";
const FONT_SIZE = "12px";

export class TextBox extends AbstractAction {
  protected _properties: TextBoxProperties;
  protected _rectNode: SVGRectElement;
  protected _titleNode: SVGTextElement;
  protected _messageNode: SVGTextElement;
  protected _textNode: SVGGElement;
  protected _spaceWidth;

  constructor() {
    super();
    this._type = ActionEnum.TEXT_BOX;
  }

  public properties(properties: TextBoxProperties = {}) {
    this._properties = { ...defaultTextBoxProperties, ...properties };
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
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .node();

    this._messageNode = d3
      .create("svg")
      .append("text")
      .attr("font-size", FONT_SIZE)
      .attr("fill", "black")
      .node();

    this._textNode = d3
      .create("svg")
      .append("g")
      .attr("fill", this._properties.backgroundColor)
      .node();

    this._textNode.append(this._titleNode);
    this._textNode.append(this._messageNode);
    this._node.appendChild(this._textNode);

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
    console.log("TextBox:_wrap words =", words);

    const calculateTextWidth = (
      element: SVGTextElement,
      word: string,
    ): number => {
      const wordElem = element.appendChild(
        d3.create("svg").append("tspan").text(word).node(),
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
          .node(),
      );
    };

    // Draw each word onto svg and save its width before removing
    const wordWidthArr: { word: string; width: number }[] = words.map(
      (word) => {
        return { word: word, width: calculateTextWidth(element, word) };
      },
    );
    console.log("TextBox:_wrap wordWidthArr =", wordWidthArr);

    // calculate the width of the backspace text
    this._spaceWidth = calculateTextWidth(element, "-");
    console.log("TextBox:_wrap _spaceWidth = ", this._spaceWidth);

    // Keep adding words to row until width exceeds span then create new row
    let accumulatedWidth = 0;
    let wordsInLine = [];
    const messageWidth = this._properties.width - PADDING;

    for (let i = 0; i < wordWidthArr.length; i++) {
      const word = wordWidthArr[i].word,
        width = wordWidthArr[i].width + this._spaceWidth;

      if (accumulatedWidth + width < messageWidth) {
        // prettier-ignore
        console.log("TextBox:_wrap wordsInLine = ", wordsInLine, ", accumulatedWidth + width = ", accumulatedWidth + width, "this._messageWidth = ", this._messageWidth)
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
    const [x1, y1] = this._dest;

    const { width, height } = this._rectNode.getBoundingClientRect();

    // left align
    if (false) {
      const x = this._dest[0] - width;
    }
    // right align
    const x = this._dest[0];
    const y = this._dest[1] - height;

    this._rectNode.setAttribute("transform", `translate(${x},${y})`);
    this._textNode.setAttribute("transform", `translate(${x + PADDING},${y})`);

    const correctTextAlignment = (textElem, width, align = undefined) => {
      const alignToX = () => {
        // uses the width and alignment of text to calculate correct x values of
        // tspan elements
        return (width / 2) * (align == "middle" ? 1 : align == "end" ? 2 : 0);
      };

      // aligns tspan elements based on chosen alignment
      Array.from(textElem.children).forEach((tspan: any) =>
        tspan.setAttribute("x", alignToX()),
      );
    };

    // align texts
    correctTextAlignment(this._titleNode, width, "middle");
    correctTextAlignment(this._messageNode, width);

    return this;
  }
}
