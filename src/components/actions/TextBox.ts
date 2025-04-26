import * as d3 from 'd3';
import { ActionName } from './ActionName';
import { Action } from './Action';
import {
  HorizontalAlign,
  VerticalAlign,
  Coordinate,
  TimeSeriesPoint,
} from '../../types';

export type TextBoxProps = {
  title?: string;
  message?: string;
  backgroundColor?: string;
  width?: number;
  showConnector?: boolean;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
};

export const defaultTextBoxProps: TextBoxProps = {
  title: '...T...',
  message: '...M...',
  backgroundColor: '#F8F8F8',
  width: 300,
  showConnector: false,
  horizontalAlign: 'center',
  verticalAlign: 'middle',
};

const PADDING = 3;
const FONT_FAMILY = 'Arial Narrow';
const FONT_SIZE = '12px';

export class TextBox extends Action {
  protected props: TextBoxProps = defaultTextBoxProps;
  protected rectNode: any;
  protected titleNode: any;
  protected messageNode: any;
  protected textNode: any;
  protected connectorNode: any;
  protected spaceWidth: number = 0;

  constructor() {
    super();
    this.type = ActionName.TEXT_BOX;
  }

  public setProps(props: TextBoxProps = {}, data?: TimeSeriesPoint) {
    this.props = { ...defaultTextBoxProps, ...props };

    if (data) {
      this.props.message = this.updateStringTemplate(this.props.message!, data);
      this.props.title = this.updateStringTemplate(this.props.title!, data);
    }
    return this;
  }

  public updateProps(args: any) {
    console.log(
      'TextBox:updateProps: args: ',
      args,
      '\nthis.props:',
      this.props,
    );
    this.props.message = this.updateStringTemplate(
      this.props.message!,
      args.data,
    );
    this.props.title = this.updateStringTemplate(this.props.title!, args.data);
    // console.log("TextBox:updateProps: ", this.props.message, this.props.title);

    this.props.horizontalAlign = args.horizontalAlign;
    this.props.verticalAlign = args.verticalAlign;
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.svg = svg;
    this.canvas();
    this.draw();
    return this;
  }

  public draw() {
    this.rectNode = d3
      .create('svg')
      .append('rect')
      .attr('fill', this.props.backgroundColor!)
      .attr('width', this.props.width!)
      .attr('rx', 3)
      .node();
    this.node.appendChild(this.rectNode);

    this.titleNode = d3
      .create('svg')
      .append('text')
      .attr('font-size', FONT_SIZE)
      .attr('font-family', FONT_FAMILY)
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .node();

    this.messageNode = d3
      .create('svg')
      .append('text')
      .attr('font-size', FONT_SIZE)
      .attr('font-family', FONT_FAMILY)
      .attr('fill', 'black')
      .node();

    this.textNode = d3
      .create('svg')
      .append('g')
      .attr('fill', this.props.backgroundColor!)
      .node();

    this.connectorNode = d3
      .create('svg')
      .append('line')
      .attr('stroke', '#808080')
      .attr('opacity', 1)
      .style('stroke-dasharray', '3,3')
      .node();

    this.textNode.append(this.titleNode);
    this.textNode.append(this.messageNode);
    this.node.appendChild(this.textNode);
    this.node.appendChild(this.connectorNode);

    // wrap title and message
    this.wrap(this.titleNode, this.props.title!);
    this.wrap(this.messageNode, this.props.message!);

    // y position of message, give some space after title
    let height = this.titleNode.getBoundingClientRect().height;
    this.messageNode.setAttribute('y', `${height + PADDING}px`);

    // y position of rect
    height = this.textNode.getBoundingClientRect().height;
    this.rectNode.setAttribute('height', `${height + PADDING}px`);

    return this;
  }

  /*
   * In SVG, text is rendered in a single line. To wrap text, we use individual
   * <tspan> elements for each row.
   */
  private wrap(element: SVGTextElement, text: string) {
    const words: string[] = text.split(' ');
    // console.log("TextBox:_wrap words =", words);

    const calculateTextWidth = (
      element: SVGTextElement,
      word: string,
    ): number => {
      const wordElem = element.appendChild(
        d3.create('svg').append('tspan').text(word).node() as SVGTSpanElement,
      ) as SVGTSpanElement;

      // console.log("TextBox:_wrap wordElem =", wordElem);
      // wordElem = <tspan>​{DATE},​</tspan>​

      const { width } = wordElem.getBoundingClientRect();
      element.removeChild(wordElem);
      return width;
    };

    const addText = (element: SVGTextElement, words: string[]) => {
      element.appendChild(
        d3
          .create('svg')
          .append('tspan')
          .attr('x', 0)
          .attr('dy', '1.1em')
          .text(words.join(' ') + ' ')
          .node() as SVGTSpanElement,
      );
    };

    // Draw each word onto svg and save its width before removing
    const wordWidthArr: { word: string; width: number }[] = words.map(
      (word) => {
        return { word: word, width: calculateTextWidth(element, word) };
      },
    );
    // console.log("TextBox:_wrap wordWidthArr =", wordWidthArr);

    // calculate the width of the backspace text
    this.spaceWidth = calculateTextWidth(element, '-');
    // console.log("TextBox:_wrap _spaceWidth = ", this._spaceWidth);

    // keep adding words to row until width exceeds span then create new row
    let accumulatedWidth = 0;
    let wordsInLine: string[] = [];
    const messageWidth = this.props.width! - PADDING;

    for (let i = 0; i < wordWidthArr.length; i++) {
      const word = wordWidthArr[i].word,
        width = wordWidthArr[i].width + this.spaceWidth;

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

  public setCoordinate(coordinate: [Coordinate, Coordinate]): this {
    this.coordinate0 = coordinate[0];
    this.coordinate1 = coordinate[1];

    const [x1, y1] = coordinate[0];
    const [x2, y2] = coordinate[1];

    const { width, height } = this.rectNode.getBoundingClientRect();
    let x = 0,
      y = 0;

    if (this.props.horizontalAlign === 'left') {
      x = x2 - width;
    } else if (this.props.horizontalAlign === 'center') {
      x = x2 - width / 2;
    } else if (this.props.horizontalAlign === 'right') {
      x = x2;
    }

    if (this.props.verticalAlign === 'top') {
      y = y2 - height;
    } else if (this.props.verticalAlign === 'middle') {
      y = y2 - height / 2;
    } else if (this.props.verticalAlign === 'bottom') {
      y = y2 + height;
    }

    d3.select(this.rectNode).attr('transform', `translate(${x},${y})`);
    d3.select(this.textNode).attr(
      'transform',
      `translate(${x + PADDING},${y})`,
    );

    // align texts
    this.correctTextAlignment(this.titleNode, width, 'center');
    this.correctTextAlignment(this.messageNode, width);

    // connector
    if (this.props.showConnector) {
      d3.select(this.connectorNode)
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2);
    }

    return this;
  }

  public move(
    coordinate: Coordinate,
    delay = 500,
    duration = 1500,
  ): Promise<any> {
    this.coordinate1 = coordinate;
    console.log('TextBox:move: coordinate1:', coordinate, this.coordinate1);

    const { width, height } = this.rectNode.getBoundingClientRect();

    // left align
    // const x = dest[0] - width;
    // center aligned
    // const x = dest[0] - width / 2;

    // right align
    const x = this.coordinate1[0];
    const y = this.coordinate1[1] - height;

    const promise1 = new Promise<number>((resolve, reject) => {
      d3.select(this.rectNode)
        .transition()
        .ease(d3.easeQuadIn)
        .duration(duration)
        .attr('transform', `translate(${x},${y})`)
        .on('end', () => {
          resolve(delay + duration);
        });
    });

    const promise2 = new Promise<number>((resolve, reject) => {
      d3.select(this.textNode)
        .transition()
        .ease(d3.easeQuadIn)
        .duration(duration)
        .attr('transform', `translate(${x + PADDING},${y})`)
        .on('end', () => {
          resolve(delay + duration);
        });
    });

    // align texts
    this.correctTextAlignment(this.titleNode, width, 'center');
    this.correctTextAlignment(this.messageNode, width);

    return Promise.all([promise1, promise2]);
  }

  private correctTextAlignment(
    textElem: SVGTextElement,
    width: number,
    align: string = 'left',
  ) {
    const alignToX = () => {
      // uses the width and alignment of text to calculate correct x values of
      // tspan elements
      return (width / 2) * (align == 'center' ? 1 : align == 'right' ? 2 : 0);
    };

    // aligns tspan elements based on chosen alignment
    Array.from(textElem.children).forEach((tspan: any) =>
      tspan.setAttribute('x', alignToX()),
    );
  }

  /**
   ** Define a function to replace variables in a string template
   **
   ** Example:
   ** const template = "Hello, ${name}! You are ${age} years old.";
   ** const variables = { name: "John Doe", age: 30 };
   ** const result = updateStringTemplate(templateString, variables);
   ** console.log(result); // Output: "Hello, John Doe! You are 30 years old."
   **/
  private updateStringTemplate(
    template: string,
    data: TimeSeriesPoint,
  ): string {
    // regex to match variable placeholders
    const variableRegex = /\${(\w+)}/g;

    return template.replace(variableRegex, (match, variableName) => {
      const value = data[variableName];

      if (value === undefined) {
        return match;
      }

      // handle date formatting if the value is a Date object
      if (variableName === 'date' && value instanceof Date) {
        return value.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      }

      // check if this variable is being used with a percentage sign
      // handle percentage formatting if the template has % after the variable
      const isFollowedByPercent = template.includes(`${match}%`);
      if (isFollowedByPercent && typeof value === 'number') {
        return (value * 100).toFixed(2);
      }

      return value.toString();
    });
  }
}
