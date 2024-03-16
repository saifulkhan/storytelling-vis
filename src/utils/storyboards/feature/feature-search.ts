import { Peak } from "./Peak";
import { Slope } from "./Slope";
import { Min } from "./Min";
import { Max } from "./Max";
import { Fall } from "./Fall";
import { Rise } from "./Raise";
import { TimeseriesData } from "../data-processing/TimeseriesData";
import {
  findDateIdx,
  maxIndex,
  mean,
  minIndex,
  normalise,
} from "../data-processing/common";

/*
 * The steps for peak search function:
 * (a) search peaks in segments for defined window sizes,
 * (b) remove duplicates, and
 * (c) eliminate peaks that are part of a larger peak.
 */
export function searchPeaks(
  data: TimeseriesData[],
  rank: number,
  metric: string,
  window: number
) {
  const peaks: Peak[] = [];
  const maxes = searchMaxes(data, window);
  const norm = normalise(data.map((o) => o.y));

  let start, end;
  for (const idx of maxes) {
    start = searchPeakStart(idx, norm);
    end = searchPeakEnd(idx, norm);

    peaks.push(
      new Peak(
        data[idx].date,
        data[idx].y,
        (end - start) / norm.length,
        norm[idx],
        rank,
        metric,
        data[start].date,
        data[end].date
      )
    );
  }

  // sort from lowest to highest
  peaks.sort((p1, p2) => p1.getHeight() - p2.getHeight());

  // peak intersection detection function
  const peaksIntersect = (p1: Peak, p2: Peak) => {
    const p1PeakIdx = findDateIdx(p1.getDate(), data);
    const p2PeakIdx = findDateIdx(p2.getDate(), data);

    return (
      (p1PeakIdx <= findDateIdx(p2.getEnd(), data) &&
        p1PeakIdx >= findDateIdx(p2.getStart(), data)) ||
      (p2PeakIdx <= findDateIdx(p1.getEnd(), data) &&
        p2PeakIdx >= findDateIdx(p1.getStart(), data))
    );
  };

  // for each peak if there is a larger peak that intersects it do not add to uniquePeaks
  const uniquePeaks = [];
  peaks.forEach((p1, i) => {
    const largerPeaks = peaks.slice(i + 1);
    const intersect = largerPeaks.find((p2) => peaksIntersect(p1, p2));
    if (!intersect) uniquePeaks.push(p1);
  });

  return uniquePeaks;
}

/*
 * This function iterates through the time series data using a sliding window
 * approach with the specified window size and calculates the slopes for each
 * window.
 */

export function searchSlopes(data: TimeseriesData[], window: number): Slope[] {
  if (data.length <= 1 || window <= 1 || window > data.length) {
    throw new Error(
      "Invalid input: time series length should be greater than 1 and window size should be a positive number less than or equal to the time series length."
    );
  }

  const slopes: Slope[] = [];

  for (let i = 0; i <= data.length - window; i++) {
    const windowData = data.slice(i, i + window);
    const xIndices = windowData.map((_, i) => i);
    const yValues = windowData.map((d) => d.y);

    const meanX = mean(xIndices);
    const meanY = mean(yValues);

    let numerator = 0;
    let denominator = 0;

    // regression
    for (let j = 0; j < xIndices.length; j++) {
      numerator += (xIndices[j] - meanX) * (yValues[j] - meanY);
      denominator += Math.pow(xIndices[j] - meanX, 2);
    }

    const slope = numerator / denominator;
    slopes.push(
      new Slope(
        windowData[Math.round(meanX)].date,
        windowData[0].date,
        windowData[windowData.length - 1].date,
        "",
        slope
      )
    );
  }

  return slopes;
}

/*******************************************************************************
 *
 ******************************************************************************/

/*
 * Function to find the end of a peak. Move forwards from the peak until the
 * gradient stops being mostly negative.
 */
function searchPeakEnd(idx: number, norm: number[]): number {
  const deltas = [];

  let i = idx;

  for (; i < idx + 20 && i < norm.length; i++) {
    deltas[i % 20] = norm[i + 1] - norm[i] < 0;
  }

  // Until line has a great majority of negative deltas keep incrementing i
  while (i < norm.length && deltas.reduce((sum, bool) => sum + bool) > 8) {
    deltas[i % 20] = norm[i + 1] - norm[i] < 0;
    i++;
  }

  // Extract line segment
  const segment = norm.slice(idx, i + 1);
  const minIdx = idx + minIndex(segment);

  return Math.min(Math.min(i, minIdx), norm.length - 1);
}

/*
 * Function to find the start of a peak. Move backward from the peak until the
 * gradient stops being mostly negative.
 */
function searchPeakStart(idx: number, norm: number[]): number {
  const deltas = [];

  let i = idx;

  for (; i > idx - 20 && i >= 0; i--) {
    deltas[i % 20] = norm[i - 1] - norm[i] < 0;
  }

  // Until line has a great majority of negative deltas keep incrementing i
  while (i >= 0 && deltas.reduce((sum, bool) => sum + bool) > 8) {
    deltas[i % 20] = norm[i - 1] - norm[i] < 0;
    i--;
  }

  // Extract line segment
  const segment = norm.slice(i, idx);
  const minIdx = i + minIndex(segment);

  return Math.max(Math.max(i, minIdx), 0);
}

/*
 * Function to find maximum points based on height difference between window
 * midpoint and edges.
 */

function searchMaxes(data: TimeseriesData[], window): number[] {
  // centre of window
  const centre = Math.floor((window - 1) / 2);
  const maxes: number[] = [];

  let start: number, midPnt: number, end: number, diff1: number, diff2: number;
  for (let i = 0; i < data.length - window; i++) {
    start = i;
    midPnt = start + centre;
    end = start + window;

    diff1 = data[midPnt].y - data[start].y;
    diff2 = data[midPnt].y - data[end].y;

    // max detected if midpoint above start and end
    if (diff1 > 0 && diff2 > 0) maxes.push(midPnt);
  }
  return maxes;
}

/*
  Fall detection function.
  Using a window size of 20 we count the number of negative gradients.
  If this number is above a threshold we keep sliding the window.
  Once our bool fails we save segment in falls array and continue searching.
*/

export function searchFalls(data, metric = undefined) {
  // Normalise y values between 0 and 1
  const norm = normalise(data.map((o) => o.y));
  const falls = [];
  const deltas = [];
  let start, mid, end, segment, normW, normGrad, grad, height, maxIdx, minIdx;

  let i = (start = end = 0);
  // Continue looping till we have looked at every point
  while (i + 20 < norm.length) {
    for (; i < end + 20 && i < norm.length - 1; i++) {
      deltas[i % 20] = norm[i + 1] - norm[i] < -0.001;
    }

    if (i >= norm.length - 1) continue;

    // While line does not have a majority negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      !(deltas.reduce((sum, bool) => sum + bool) > 5)
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] < -0.001;
      i++;
    }

    if (i >= norm.length - 1) continue;
    start = i == 20 ? 0 : i - 15;

    // Until line has a great majority of negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      deltas.reduce((sum, bool) => sum + bool) > 5
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] < 0;
      i++;
    }
    end = i >= norm.length - 1 ? norm.length - 1 : i - 15;

    // Extract line segment
    segment = norm.slice(start, end + 1);
    maxIdx = start + maxIndex(segment);
    minIdx = start + minIndex(segment);

    // Trim line so no overflowing segements
    start = Math.max(maxIdx, start); // Should start at the highest point
    end = Math.min(minIdx, end); // Should end at the lowest point
    mid = Math.floor((start + end) / 2);

    height = Math.abs(data[end].y - data[start].y);
    grad = height / (end - start);

    normW = (end - start) / norm.length; // Ratio of length of segment and total data size.
    normGrad = Math.abs((norm[end] - norm[start]) / normW);

    // If the increase in y is passed a certain threshold add to rises array.
    if (norm[end] - norm[start] < -normW * 0.6) {
      falls.push(
        new Fall()
          .setDate(data[mid].date)
          .setStart(data[start].date)
          .setEnd(data[end].date)
          .setHeight(height)
          .setMetric(metric)
          .setGrad(grad)
          .setNormGrad(normGrad)
      );
      i = end;
    }

    i++;
  }
  return falls;
}

/*
  Rise detection function.
  Using a window size of 20 we count the number of positive gradients.
  If this number is above a threshold we keep sliding the window.
  Once our bool fails we save segment in rises array and continue searching.
*/

export function searchRises(data, metric = undefined) {
  // Normalise y values between 0 and 1
  const norm = normalise(data.map((o) => o.y));

  const rises = [];
  const deltas = [];
  const rDeltas = [];
  let start, mid, end, segment, normW, normGrad, grad, height, maxIdx, minIdx;

  let i = (start = end = 0);
  // Continue looping till we have looked at every point
  while (i + 20 < norm.length) {
    for (; i < end + 20 && i < norm.length - 1; i++) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0.001;
    }

    if (i >= norm.length - 1) continue;

    // While line does not have a majority positive deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      !(deltas.reduce((sum, bool) => sum + bool) > 5)
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0.001;
      i++;
    }
    if (i >= norm.length - 1) continue;
    start = i == 20 ? 0 : i - 10;

    // Until line has a great majority of negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      deltas.reduce((sum, bool) => sum + bool) > 5
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0;
      i++;
    }
    end = i >= norm.length - 1 ? norm.length - 1 : i - 15;

    // Extract line segment
    segment = norm.slice(start, end + 1);
    maxIdx = start + maxIndex(segment);
    minIdx = start + minIndex(segment);

    // Trim line so no overflowing segements
    start = Math.max(minIdx, start); // Should start at the minimum point
    end = Math.min(maxIdx, end); // Should end at the maximum point
    mid = Math.floor((start + end) / 2);

    height = Math.abs(data[end].y - data[start].y);
    grad = height / (end - start);

    normW = (end - start) / norm.length; // Ratio of length of segment and total data size.
    normGrad = Math.abs((norm[end] - norm[start]) / normW);

    // If the decrease in y is passed a certain threshold add to rises array.
    if (norm[end] - norm[start] > normW * 0.6) {
      rises.push(
        new Rise()
          .setDate(data[mid].date)
          .setStart(data[start].date)
          .setEnd(data[end].date)
          .setHeight(height)
          .setGrad(grad)
          .setMetric(metric)
          .setNormGrad(normGrad)
      );
      i = end;
    }

    i++;
  }

  return rises;
}

/**
 ** Given a list of numbers, find the local minimum and maximum data points.
 ** Example usage:
 ** const [localMin, localMax] =
 ** findLocalMinMax(data, "mean_test_accuracy");
 **/

export function findLocalMinMax(input: any[], key: string, window = 2): any {
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
      // if the previous value is different and the next are equal then we've
      // found a min/max
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
 ** Example usage:
 ** const [globalMin, globalMax] =
 ** searchMinMax(data, "mean_test_accuracy);
 **/
export function searchMinMax(input: any[], key: string, window = 2): any {
  const outputMin = input.reduce((min, curr) =>
    min[key] < curr[key] ? min : curr
  );
  const outputMax = input.reduce((max, curr) =>
    max[key] > curr[key] ? max : curr
  );

  return [
    new Min(outputMin.date, "", outputMin[key]),
    new Max(outputMax.date, "", outputMax[key]),
  ];
}
