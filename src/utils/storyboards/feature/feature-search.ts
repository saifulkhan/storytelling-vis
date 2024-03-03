import { Peak } from "./Peak";
import { Slope } from "./Slope";
import { findDateIdx, mean } from "../processing/common";
import { CategoricalFeature } from "./CategoricalFeature";
import { CategoricalFeatureEnum } from "./CategoricalFeatureEnum";
import { TimeseriesDataType } from "../processing/TimeseriesDataType";

const MAX_RANK = 5;

/*
 * Create numerical timeseries
 */
export function nts(
  data: TimeseriesDataType[],
  metric: string,
  window: number,
) {
  const nts: Peak[] = searchPeaks(data, metric, window);

  // rank peaks by its height, assign rank between 1 to MAX_RANK
  const rankByHeight = (peaks: Peak[]) => {
    peaks.sort((p1, p2) => p1.height - p2.height);
    const nPeaks = peaks.length;
    // size of each ranking group
    const groupSize = nPeaks / MAX_RANK;
    peaks.forEach((p, i) => (p.rank = 1 + Math.floor(i / groupSize)));
  };

  rankByHeight(nts);
  return nts;
}

/*
 * Create categorical timeseries
 */
export function cts() {
  const a = new CategoricalFeature(
    new Date("2020-03-24"),
    "Start of First Lockdown.",
    CategoricalFeatureEnum.LOCKDOWN_START,
    5,
  );

  const b = new CategoricalFeature(
    new Date("2021-01-05"),
    "Start of Second Lockdown.",
    CategoricalFeatureEnum.LOCKDOWN_END,
    3,
  );

  const c = new CategoricalFeature(
    new Date("2020-05-28"),
    "End of First Lockdown.",
    CategoricalFeatureEnum.LOCKDOWN_END,
    5,
  );

  const cts = [a, b, c];
  return cts;
}

/*
 * The steps for peak search function:
 * (a) search peaks in segments for defined window sizes,
 * (b) remove duplicates, and
 * (c) eliminate peaks that are part of a larger peak.
 */
export function searchPeaks(
  data: TimeseriesDataType[],
  metric: string,
  window: number,
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
        data[start].date,
        data[end].date,
        metric,
        data[idx].y,
        (end - start) / norm.length,
        norm[idx],
      ),
    );
  }

  // sort from lowest to highest
  peaks.sort((p1, p2) => p1.height - p2.height);

  // peak intersection detection function
  const peaksIntersect = (p1, p2) => {
    const p1PeakIdx = findDateIdx(p1._date, data);
    const p2PeakIdx = findDateIdx(p2._date, data);

    return (
      (p1PeakIdx <= findDateIdx(p2._end, data) &&
        p1PeakIdx >= findDateIdx(p2._start, data)) ||
      (p2PeakIdx <= findDateIdx(p1._end, data) &&
        p2PeakIdx >= findDateIdx(p1._start, data))
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

export function searchSlopes(
  data: TimeseriesDataType[],
  window: number,
): Slope[] {
  if (data.length <= 1 || window <= 1 || window > data.length) {
    throw new Error(
      "Invalid input: time series length should be greater than 1 and window size should be a positive number less than or equal to the time series length.",
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
        slope,
      ),
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

function searchMaxes(data: TimeseriesDataType[], window): number[] {
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
 * Min-Max normalization of data of the form [x0, x1, ...xn]
 */
function normalise(data: number[]) {
  // get min and max values from data (for normalization)
  const [min, max] = data
    .slice(1)
    .reduce(
      (res, d) => [Math.min(d, res[0]), Math.max(d, res[1])],
      [data[0], data[0]],
    );

  // normalise y values to be between 0 and 1
  return data.map((d) => (d - min) / (max - min));
}

function minIndex(values: number[], valueof?) {
  let min;
  let minIndex = -1;
  let index = -1;
  if (valueof === undefined) {
    for (const value of values) {
      ++index;
      if (
        value != null &&
        (min > value || (min === undefined && value >= value))
      ) {
        (min = value), (minIndex = index);
      }
    }
  } else {
    for (let value of values) {
      if (
        (value = valueof(value, ++index, values)) != null &&
        (min > value || (min === undefined && value >= value))
      ) {
        (min = value), (minIndex = index);
      }
    }
  }
  return minIndex;
}

/*
 * Linear regression function inspired by the answer found at: https://stackoverflow.com/a/31566791.
 * We remove the need for array x as we assume y data is equally spaced and we only want the gradient.
 */

function linRegGrad(y) {
  let slope = {};
  const n = y.length;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;

  for (let i = 0; i < y.length; i++) {
    sum_x += i;
    sum_y += y[i];
    sum_xy += i * y[i];
    sum_xx += i * i;
  }

  slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  return slope;
}
