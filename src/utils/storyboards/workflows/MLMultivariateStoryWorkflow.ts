import * as d3 from "d3";
import { AbstractWorkflow } from "./AbstractWorkflow";
import { readCSVFile } from "../../../services/data";
import { ParallelCoordinatePlot } from "../../../components/storyboards/plots/ParallelCoordinatePlot";

const FILE = "/static/storyboards/ml/data.csv";

// TODO: should it be a type?
const parameters = [
  "date",
  "mean_test_accuracy",
  "mean_training_accuracy",
  "channels",
  "kernel_size",
  "layers",
  "samples_per_class",
];
const KEYS = ["channels", "kernel_size", "layers", "samples_per_class"];

export class MLMultiVariateStoryWorkflow extends AbstractWorkflow {
  protected _data: any[] = [];
  protected _key: string;

  constructor() {
    super();
  }

  protected async data() {
    const csv: any[] = await readCSVFile(FILE);
    // prettier-ignore
    // console.log("MLMultivariateStoryWorkflow:load: FILE = ", FILE, ", csv = ", csv);

    // Convert to integer and date
    csv.forEach((row) => {

      this._data.push({
        "date" :new Date(row.date),
        "mean_test_accuracy" : +row.mean_test_accuracy,
        "mean_training_accuracy" : +row.mean_training_accuracy,
        "channels" : +row.channels,
        "kernel_size" : +row.kernel_size,
        "layers" : +row.layers,
        "samples_per_class" : +row.samples_per_class,  
      });
    });

    // parameters = data.columns.slice(1);
    // prettier-ignore
    console.log("MLMultiVariateStoryWorkflow: loadData: _data = ", this._data);
  }

  keys(): string[] {
    return KEYS;
  }

  public selector(id: string) {
    this._svg = d3
      .select(id)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 600)
      .node();

    console.log("MLMultiVariateStoryWorkflow:selector: _svg = ", this._svg);
    return this;
  }

  create(key: string) {
    this._key = key;

    //

    // prettier-ignore
    console.log("create: key = ", key);

    // Sort data by selected keyz, e.g, "kernel_size"
    let idx = 0;
    let data = this._data
      .slice()
      .sort((a, b) => d3.ascending(a[key], b[key]))
      .sort((a, b) => d3.ascending(a["date"], b["date"]));
    // .map((d) => ({ ...d, index: idx++ })); // update index of the reordered data 0, 1, 2,...

    const [localMin, localMax] = this.findLocalMinMax(
      data,
      "mean_test_accuracy"
    );
    const [globalMin, globalMax] = this.findGlobalMinMax(
      data,
      "mean_test_accuracy"
    );

    console.log("After sorting, data = ", data);
    // prettier-ignore
    console.log("globalMin = ", globalMin, ", globalMax = ", globalMax);

    let plot = new ParallelCoordinatePlot()
      .svg(this._svg)
      .data(data, key)
      .plot();

    return this;
  }

  //
  //
  //

  /**
   ** Given a list of numbers, find the local minimum and maximum data points.
   ** Example usage:
   **   const [localMin, localMax] = this.findLocalMinMax(data,
   **                                                     "mean_test_accuracy");
   **/

  findLocalMinMax(input: any[], key: string, window = 2): any {
    // prettier-ignore
    // console.log("findLocalMinMax: input = ", input, ", keyz = ", key);

    // Given two numbers, return -1, 0, or 1
    const compare = (a: number, b: number): number => {
      if (a === b) {
        return 0;
      }
      if (a < b) {
        return -1;
      }
      return 1;
    };

    const outputMin = [];
    const outputMax = [];

    // keep track of the direction: down vs up
    let direction = 0;
    let prevEqual = true;

    // if 0th != 1st, 0th is a local min / max
    if (input[0][key] !== input[1][key]) {
      direction = compare(input[0][key], input[1][key]);
      prevEqual = false;

      direction === -1 && outputMin.push(input[0]);
      direction === 1 && outputMax.push(input[0]);
    }

    // loop through other numbers
    for (let i = 1; i < input.length - 1; i++) {
      // compare this to next
      const nextDirection = compare(input[i][key], input[i + 1][key]);
      if (nextDirection !== 0) {
        if (nextDirection !== direction) {
          direction = nextDirection;
          // if we didn't already count value, add it here
          if (!prevEqual) {
            direction === -1 && outputMin.push(input[i]);
            direction === 1 && outputMax.push(input[i]);
          }
        }
        prevEqual = false;
      } else if (!prevEqual) {
        // if the previous value is different and the next are equal
        // then we've found a min/max
        prevEqual = true;
        direction === -1 && outputMin.push(input[i]);
        direction === 1 && outputMax.push(input[i]);
      }
    }

    // check last index
    if (
      compare(input[input.length - 2][key], input[input.length - 1][key]) !== 0
    ) {
      direction === -1 && outputMin.push(input[input.length - 1]);
      direction === 1 && outputMax.push(input[input.length - 1]);
    }

    // prettier-ignore
    // console.log("findLocalMinMax: outputMin = ", outputMin);
    // console.log("findLocalMinMax: outputMax = ", outputMax);

    return [outputMin, outputMax];
  }

  /**
   **
   ** Example usage:
   ** const [globalMin, globalMax] = this.findGlobalMinMax(data,
   **                                                      "mean_test_accuracy);
   **/

  findGlobalMinMax(input: any[], key: string, window = 2): any {
    const outputMin = input.reduce((min, curr) =>
      min[key] < curr[key] ? min : curr
    );
    const outputMax = input.reduce((max, curr) =>
      max[key] > curr[key] ? max : curr
    );

    return [outputMin, outputMax];
  }
}
