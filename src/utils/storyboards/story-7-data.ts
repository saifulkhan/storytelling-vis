import * as d3 from "d3";
import { readCSVFile } from "../../services/data";
import { AnimationType } from "src/models/AnimationType";
import {
  LearningCurve,
  LearningCurveData,
} from "../../components/storyboards/plots/LearningCurve";
import { Color, DotColor } from "../../components/storyboards/Colors";
import { NumericalFeatureType } from "./processing/NumericalFeatureType";
import {
  GraphAnnotation,
  LCPAnnotation,
} from "../../components/storyboards/plots/GraphAnnotation";

/*******************************************************************************
 ** Prepare data
 ******************************************************************************/

let data;

const selectableParameters = [
  "channels",
  "kernel_size",
  "layers",
  "samples_per_class",
];

/*
 * Load data
 */
export async function loadData(): Promise<void> {
  data = [];

  const csv = await readCSVFile(
    // "/static/story-boards/ml-data/test-parallel-coordinate.csv",
    "/static/storyboards/ml-data/storyboard_data2.csv",
  );
  // Convert to integer and date
  csv.forEach((row) => {
    row.index = +row.index;
    row.date = new Date(row.date);
    row.mean_test_accuracy = +row.mean_test_accuracy;
    row.mean_training_accuracy = +row.mean_training_accuracy;
    row.channels = +row.channels;
    row.kernel_size = +row.kernel_size;
    row.layers = +row.layers;
    row.samples_per_class = +row.samples_per_class;

    data.push(row);
  });
  // parameters = data.columns.slice(1);

  console.log("story-7-data:loadData: csv =", csv);
  console.log("story-7-data: loadData: data = ", data);
}

export function getParameters() {
  return selectableParameters;
}

/*******************************************************************************
 ** Filter/select parameter
 ** Create annotation objects
 ******************************************************************************/

let selectedParameter;
let filteredData: LearningCurveData[] = [];
let focusAnnotations: LCPAnnotation[];
let contextAnnotations: LCPAnnotation[];

export function filterData(_parameter: string) {
  selectedParameter = _parameter;
  // prettier-ignore
  console.log("story-7-data: filterData: selectedParameter = ", selectedParameter);

  filteredData = [];
  data.forEach((d, idx) => {
    filteredData.push({
      date: d.date,
      y: d.mean_test_accuracy,
      x: d[selectedParameter],
      channels: d.channels,
      kernel_size: d.kernel_size,
      layers: d.layers,
      samples_per_class: d.samples_per_class,
    } as LearningCurveData);
  });
  // Sort data by selected keyz, e.g, "kernel_size"
  filteredData = filteredData
    .slice()
    .sort((a, b) => d3.ascending(a.date, b.date))
    .sort((a, b) => d3.ascending(a.x, b.x));
  // prettier-ignore
  console.log("story-7-data: filterData: filteredData = ", filteredData);

  calculateAnnotations();
}

// Find index of highest attr (e.g., highest testing accuracy)
const indexOfMax = (arr, attr) => {
  const max = Math.max(...arr.map((d) => d[attr]));
  return arr.findIndex((d) => d[attr] === max);
};

export function getData(): [LearningCurveData[], number] {
  return [filteredData, indexOfMax(filteredData, "y")];
}

function calculateAnnotations() {
  focusAnnotations = [];
  contextAnnotations = [];

  const maxIdx = indexOfMax(filteredData, "y");
  // prettier-ignore
  console.log("utils-story-5: calculateAnnotations: maxIdx = ", maxIdx);

  filteredData.forEach((d, idx) => {
    // Feature 1: maximum accuracy
    if (idx === maxIdx) {
      const msg = null;
      focusAnnotations.push(
        writeText(msg, d, idx, NumericalFeatureType.MAX, true, true),
      );
      contextAnnotations.push(
        writeText(msg, d, idx, NumericalFeatureType.MAX, true, true),
      );
    }
    // Feature 2: current
    else {
      const msg = null;
      focusAnnotations.push(
        writeText(msg, d, idx, NumericalFeatureType.CURRENT, true, false),
      );
      contextAnnotations.push(
        writeText(msg, d, idx, NumericalFeatureType.CURRENT, true, false),
      );
    }
  });

  // Sort annotations
  focusAnnotations.sort((a1, a2) => a1.end - a2.end);
  focusAnnotations.push({ end: filteredData.length - 1 });
  // Set annotations starts to the start annotation's end
  focusAnnotations
    .slice(1)
    .forEach((d: LCPAnnotation, i) => (d.start = focusAnnotations[i].end));

  // Sort annotations
  contextAnnotations.sort((a1, a2) => a1.end - a2.end);
  contextAnnotations.push({ end: filteredData.length - 1 });
  // Set annotations starts to the start annotation's end
  contextAnnotations
    .slice(1)
    .forEach((d: LCPAnnotation, i) => (d.start = contextAnnotations[i].end));

  // prettier-ignore
  console.log("utils-story-5: calculateAnnotations: focusAnnotations = ", focusAnnotations);
  // prettier-ignore
  console.log("utils-story-5: calculateAnnotations: contextAnnotations = ", contextAnnotations);
}

function writeText(
  text,
  data,
  idx,
  featureType: NumericalFeatureType,
  showDot = false,
  showCircle = false,
): LCPAnnotation {
  const graphAnnotation = new GraphAnnotation();
  // .title(date.toLocaleDateString("en-GB"))
  // .label(text)
  // .backgroundColor(Color.WhiteGrey)
  // .titleColor(Color.Grey)
  // .labelColor(TextColor[featureType])
  // .connectorColor(Color.LightGrey2)
  // .fontSize("13px")
  // .wrap(500);

  showCircle && graphAnnotation.circleAttr(10, DotColor[featureType], 3, 0.6);
  showDot && graphAnnotation.dotAttr(5, DotColor[featureType], 1);

  return {
    graphAnnotation: graphAnnotation,
    end: idx,
    featureType: featureType,
    fadeout: true,
    unscaledTarget: [data.x, data.y],
  } as LCPAnnotation;
}

/*******************************************************************************
 * Create or init TimeSeries.
 * Animate when button is clicked.
 ******************************************************************************/

let lc;

export function createPlot(selector: string) {
  // prettier-ignore
  console.log("story-7-data: createPlot: selector = ", selector, ", selectedParameter = ", selectedParameter);

  const _current: LearningCurveData = filteredData.reduce((a, b) =>
    a.date > b.date ? a : b,
  );
  const _maxTesting = filteredData.reduce((a, b) => (a.y > b.y ? a : b));
  // prettier-ignore
  console.log("story-7-data: createPlot: _current = ", _current, "_maxTesting = ", _maxTesting);

  lc = new LearningCurve(selector)
    .data(filteredData)
    .title("")
    .xLabel(selectedParameter)
    .yLabel("Test accuracy")
    .ticks(10)
    .lineColor(Color.LightGrey1)
    .lineStroke(1)
    .dotColor(Color.DarkGrey)
    // .dotHighlightColor(Color.Red) // TODO:  we use annotation now, so remove this and below 2 methods
    .currentPoint(_current, DotColor[NumericalFeatureType.CURRENT])
    .maxPoint(_maxTesting, DotColor[NumericalFeatureType.MAX])
    .annotationOnTop()
    .annotate(focusAnnotations, contextAnnotations);

  // .plot();
}

export function animatePlot(animationType: AnimationType) {
  // prettier-ignore
  console.log("utils-story-7: animatePlot: animationType = ", animationType);
  lc.animate(animationType);
}
