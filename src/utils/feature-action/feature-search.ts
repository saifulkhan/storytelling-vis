import { Peak } from './Peak';
import { Slope } from './Slope';
import { Min } from './Min';
import { Max } from './Max';
import { Fall } from './Fall';
import { Rise } from './Raise';
import { TimeSeriesData } from 'src/types/TimeSeriesPoint';
import { findDateIdx, maxIndex, mean, minIndex, normalise } from '../common';
import { Current } from './Current';
import { Last } from './Last';
import { CategoricalFeature } from './CategoricalFeature';

const WINDOW = 10;

/**
 ** The function search peaks in a given timeseries.
 ** The steps involve searching for peaks in segments for defined window sizes,
 ** remove duplicates, and eliminate peaks that are part of a larger peak.
 **/
export function searchPeaks(
  data: TimeSeriesData,
  rank: number = 0,
  metric: string = '',
  window: number = WINDOW,
): Peak[] {
  const peaks: Peak[] = [];
  const maxes = searchMaxes(data, window);
  const norm = normalise(data.map((d) => d.y ?? 0));

  console.log('maxes:', maxes);

  let start, end;
  for (const idx of maxes) {
    start = searchPeakStart(idx, norm);
    end = searchPeakEnd(idx, norm);

    // console.log("idx:", idx);

    const peak = new Peak()
      .setDate(data[idx].date)
      .setHeight(data[idx].y ?? 0)
      .setNormWidth((end - start) / norm.length)
      .setNormHeight(norm[idx])
      .setRank(rank)
      .setMetric(metric)
      .setStart(data[start].date)
      .setEnd(data[end].date)
      .setDataIndex(idx);

    peaks.push(peak);
    // console.log("peaks:", peaks);
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
  const uniquePeaks: Peak[] = [];
  peaks.forEach((p1, i) => {
    const largerPeaks = peaks.slice(i + 1);
    const intersect = largerPeaks.find((p2) => peaksIntersect(p1, p2));
    if (!intersect) uniquePeaks.push(p1);
  });

  return uniquePeaks;
}

/*
 * Function to find the end of a peak. Move forwards from the peak until the
 * gradient stops being mostly negative.
 */
function searchPeakEnd(idx: number, norm: number[]): number {
  const deltas: boolean[] = [];

  let i = idx;

  for (; i < idx + 20 && i < norm.length; i++) {
    deltas[i % 20] = norm[i + 1] - norm[i] < 0;
  }

  // Until line has a great majority of negative deltas keep incrementing i
  while (
    i < norm.length &&
    deltas.reduce((sum, bool) => sum + (bool ? 1 : 0), 0) > 8
  ) {
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
  const deltas: boolean[] = [];

  let i = idx;

  for (; i > idx - 20 && i >= 0; i--) {
    deltas[i % 20] = norm[i - 1] - norm[i] < 0;
  }

  // Until line has a great majority of negative deltas keep incrementing i
  while (i >= 0 && deltas.reduce((sum, bool) => sum + (bool ? 1 : 0), 0) > 8) {
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
function searchMaxes(data: TimeSeriesData, window: number): number[] {
  // centre of window
  const centre = Math.floor((window - 1) / 2);
  const maxes: number[] = [];

  let start: number, midPnt: number, end: number, diff1: number, diff2: number;
  for (let i = 0; i < data.length - window; i++) {
    start = i;
    midPnt = start + centre;
    end = start + window;

    diff1 = (data[midPnt].y ?? 0) - (data[start].y ?? 0);
    diff2 = (data[midPnt].y ?? 0) - (data[end].y ?? 0);

    // max detected if midpoint above start and end
    if (diff1 > 0 && diff2 > 0) maxes.push(midPnt);
  }
  return maxes;
}

/******************************************************************************/

/**
 ** The function search slopes in a given timeseries.
 ** The steps involve iterating through the time series data using a sliding
 ** window approach with the specified window size and calculates the slopes for
 ** each window.
 */

export function searchSlopes(
  data: TimeSeriesData,
  rank: number,
  metric: string,
  window: number,
): Slope[] {
  if (data.length <= 1 || window <= 1 || window > data.length) {
    throw new Error(
      'Invalid input: time series length should be greater than 1 and window size should be a positive number less than or equal to the time series length.',
    );
  }

  const slopes: Slope[] = [];

  for (let i = 0; i <= data.length - window; i++) {
    const windowData = data.slice(i, i + window);
    const xIndices = windowData.map((_, i) => i);
    const yValues = windowData.map((d) => d.y ?? 0);

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
    const idx = Math.round(meanX);

    slopes.push(
      new Slope()
        .setDate(windowData[idx].date)
        .setHeight(windowData[idx].y ?? 0)
        .setRank(rank)
        .setMetric(metric)
        .setStart(windowData[0].date)
        .setEnd(windowData[windowData.length - 1].date)
        .setDataIndex(idx)
        .setSlope(slope),
    );
  }

  return slopes;
}

/******************************************************************************/

/*
  Fall detection function.
  Using a window size of 20 we count the number of negative gradients.
  If this number is above a threshold we keep sliding the window.
  Once our bool fails we save segment in falls array and continue searching.
*/
// TODO: test
export function searchFalls(data: TimeSeriesData, metric: string = ''): Fall[] {
  // Normalise y values between 0 and 1
  const norm = normalise(data.map((o: { y?: number }) => o.y ?? 0));
  const falls = [];
  const deltas: boolean[] = [];
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
      !(deltas.reduce((sum, bool) => sum + (bool ? 1 : 0), 0) > 5)
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] < -0.001;
      i++;
    }

    if (i >= norm.length - 1) continue;
    start = i == 20 ? 0 : i - 15;

    // Until line has a great majority of negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      deltas.reduce((sum, bool) => sum + (bool ? 1 : 0), 0) > 5
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

    height = Math.abs((data[end].y ?? 0) - (data[start].y ?? 0));
    grad = height / (end - start);

    normW = (end - start) / norm.length; // Ratio of length of segment and total data size.
    normGrad = Math.abs((norm[end] - norm[start]) / normW);

    // If the increase in y is passed a certain threshold add to rises array.
    if (norm[end] - norm[start] < -normW * 0.6) {
      falls.push(
        new Fall(
          data[mid].date,
          height,
          undefined,
          metric,
          data[start].date,
          data[end].date,
        )
          .setGrad(grad)
          .setNormGrad(normGrad),
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

/******************************************************************************/
// TODO: test
export function searchRises(data: TimeSeriesData, metric: string = ''): Rise[] {
  // Normalise y values between 0 and 1
  const norm = normalise(data.map((o: { y?: number }) => o.y ?? 0));

  const rises = [];
  const deltas: boolean[] = [];
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
      !(deltas.reduce((sum, bool) => sum + (bool ? 1 : 0), 0) > 5)
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0.001;
      i++;
    }
    if (i >= norm.length - 1) continue;
    start = i == 20 ? 0 : i - 10;

    // Until line has a great majority of negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      deltas.reduce((sum, bool) => sum + (bool ? 1 : 0), 0) > 5
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

    height = Math.abs((data[end].y ?? 0) - (data[start].y ?? 0));
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
          .setNormGrad(normGrad),
      );
      i = end;
    }

    i++;
  }

  return rises;
}

/******************************************************************************/

/**
 ** Given a list of numbers, find the local minimum and maximum data points.
 ** Example usage:
 ** const [localMin, localMax] =
 ** findLocalMinMax(data, "mean_test_accuracy");
 **/
// TODO: test
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
  if (
    input.length >= 2 &&
    input[0] &&
    input[1] &&
    input[0][key] !== undefined &&
    input[1][key] !== undefined &&
    input[0][key] !== input[1][key]
  ) {
    direction = compare(input[0][key], input[1][key]);
    prevEqual = false;

    direction === -1 && outputMin.push(input[0]);
    direction === 1 && outputMax.push(input[0]);
  }

  // loop through other numbers
  for (let i = 1; i < input.length - 1; i++) {
    // compare this to next
    const nextDirection =
      input[i] &&
      input[i + 1] &&
      input[i][key] !== undefined &&
      input[i + 1][key] !== undefined
        ? compare(input[i][key], input[i + 1][key])
        : 0;
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
    input.length >= 2 &&
    input[input.length - 2] &&
    input[input.length - 1] &&
    input[input.length - 2][key] !== undefined &&
    input[input.length - 1][key] !== undefined &&
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

/******************************************************************************/

/**
 ** The function search global max in a given timeseries.
 **/
export function searchGlobalMax(
  data: TimeSeriesData,
  rank: number,
  metric: string,
): Max[] {
  const maxPoint = data.reduce((max, curr) =>
    (max.y ?? 0) > (curr.y ?? 0) ? max : curr,
  );
  const max = new Max()
    .setDate(maxPoint.date)
    .setHeight(maxPoint.y ?? 0)
    .setRank(rank)
    .setMetric(metric)
    .setDataIndex(findDateIdx(maxPoint.date, data));

  return [max];
}

/**
 ** The function search global min in a given timeseries.
 **/
export function searchGlobalMin(
  data: TimeSeriesData,
  rank: number,
  metric: string,
): Min[] {
  const minPoint = data.reduce((max, curr) =>
    (max.y ?? 0) < (curr.y ?? 0) ? max : curr,
  );
  const min = new Min()
    .setDate(minPoint.date)
    .setHeight(minPoint.y ?? 0)
    .setRank(rank)
    .setMetric(metric)
    .setDataIndex(findDateIdx(minPoint.date, data));

  return [min];
}

/**
 ** The function returns first data point
 **/
export function searchFirst(
  data: TimeSeriesData,
  rank: number,
  metric: string,
): Min[] {
  let dataX = data[0];
  return [
    new Last()
      .setDate(dataX.date)
      .setHeight(dataX.y ?? 0)
      .setRank(rank)
      .setMetric(metric)
      .setDataIndex(findDateIdx(dataX.date, data)),
  ];
}

/**
 ** The function returns current data points.
 **/
export function searchCurrent(
  data: TimeSeriesData,
  rank: number,
  metric: string,
): Min[] {
  return data.map((d) =>
    new Current()
      .setDate(d.date)
      .setHeight(d.y ?? 0)
      .setRank(rank)
      .setMetric(metric)
      .setDataIndex(findDateIdx(d.date, data)),
  );
}

/**
 ** The function last data point
 **/
export function searchLast(
  data: TimeSeriesData,
  rank: number,
  metric: string,
): Min[] {
  let dataX = data[data.length - 1];
  return [
    new Last()
      .setDate(dataX.date)
      .setHeight(dataX.y ?? 0)
      .setRank(rank)
      .setMetric(metric)
      .setDataIndex(findDateIdx(dataX.date, data)),
  ];
}

/**
 * Finds the categorical feature for a given date from a list of categorical features.
 * @param features - Array of CategoricalFeature objects
 * @param date - The date to search for (Date object)
 * @returns The CategoricalFeature for the given date, or undefined if not found
 */
export function findCategoricalFeatureByDate(
  features: CategoricalFeature[],
  date: Date,
): CategoricalFeature | undefined {
  return features.find((feature) => {
    // Compare dates ignoring time
    return feature.getDate().toDateString() === date.toDateString();
  });
}

/**
 * Finds the categorical feature closest to a given date from a list of categorical features.
 * If an exact match is found, it returns that feature. Otherwise, it returns the feature
 * with the closest date within a specified maximum difference (in days).
 * 
 * @param features - Array of CategoricalFeature objects
 * @param date - The date to search for (Date object)
 * @param maxDaysDifference - Maximum allowed difference in days (default: 3)
 * @returns The closest CategoricalFeature, or undefined if none found within the allowed range
 */
export function findClosestCategoricalFeature(
  features: CategoricalFeature[],
  date: Date,
  maxDaysDifference: number = 3
): CategoricalFeature | undefined {
  // First try to find an exact match
  const exactMatch = features.find((feature) => 
    feature.getDate().toDateString() === date.toDateString()
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, find the closest one within maxDaysDifference
  const targetTime = date.getTime();
  let closestFeature: CategoricalFeature | undefined;
  let minDifference = Number.MAX_SAFE_INTEGER;
  
  for (const feature of features) {
    const featureTime = feature.getDate().getTime();
    const timeDifference = Math.abs(featureTime - targetTime);
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    
    if (daysDifference <= maxDaysDifference && daysDifference < minDifference) {
      minDifference = daysDifference;
      closestFeature = feature;
    }
  }
  
  return closestFeature;
}
