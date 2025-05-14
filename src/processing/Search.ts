import { Peak } from '../feature/Peak';
import { Slope } from '../feature/Slope';
import { Min } from '../feature/Min';
import { Max } from '../feature/Max';
import { Fall } from '../feature/Fall';
import { Rise } from '../feature/Raise';
import { TimeSeriesData } from '../types';
import { Current } from '../feature/Current';
import { Last } from '../feature/Last';
import { CategoricalFeature } from '../feature/CategoricalFeature';
import { NumericalFeature } from '../feature/NumericalFeature';
import { Utils } from './Utils';

/**
 * Search class containing static methods for feature detection in time series data
 */
export class Search {
  private static readonly WINDOW = 10;

  /**
   * Searches for significant peaks in a time series dataset.
   *
   * This function identifies peaks in the data by:
   * 1. Finding local maxima using a sliding window approach
   * 2. Determining the start and end points of each peak
   * 3. Creating Peak objects with relevant metadata
   * 4. Filtering out overlapping peaks to keep only the most significant ones
   *
   * @param data - The time series data to analyze
   * @param rank - Importance rank to assign to detected peaks (default: 0)
   * @param metric - Name of the metric being analyzed (default: '')
   * @param window - Size of the sliding window for peak detection (default: WINDOW)
   * @returns Array of unique Peak objects representing significant peaks in the data
   */
  public static searchPeaks(
    data: TimeSeriesData,
    rank: number = 0,
    metric: string = '',
    window: number = Search.WINDOW,
  ): Peak[] {
    if (!data || data.length < window) {
      console.warn(
        'searchPeaks: Insufficient data points for the specified window size',
      );
      return [];
    }

    // Find potential peak indices
    const maxes = Search.searchMaxes(data, window);
    if (maxes.length === 0) {
      return [];
    }

    // Normalize y-values for consistent peak analysis
    const norm = Utils.normalise(data.map((d) => d.y ?? 0));

    // Create Peak objects for each detected maximum
    const peaks: Peak[] = [];
    for (const idx of maxes) {
      // Find the boundaries of each peak
      const start = Search.searchPeakStart(idx, norm);
      const end = Search.searchPeakEnd(idx, norm);

      // Skip invalid peaks (where start/end couldn't be properly determined)
      if (start >= end || start < 0 || end >= data.length) {
        continue;
      }

      // Create and configure the Peak object
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
    }

    // Sort peaks by height (descending) to prioritize larger peaks when filtering
    peaks.sort((p1, p2) => p2.getHeight() - p1.getHeight());

    // Efficient peak intersection detection using cached indices
    const dateIndices = new Map<Date, number>();

    // Filter out overlapping peaks, keeping the most significant ones
    const uniquePeaks: Peak[] = [];
    const isOverlapping = new Array(peaks.length).fill(false);

    // Mark peaks that overlap with more significant peaks
    for (let i = 0; i < peaks.length; i++) {
      if (isOverlapping[i]) continue;

      for (let j = i + 1; j < peaks.length; j++) {
        if (
          !isOverlapping[j] &&
          Search.peaksIntersect(peaks[i], peaks[j], data, dateIndices)
        ) {
          isOverlapping[j] = true;
        }
      }
    }

    // Add non-overlapping peaks to the result
    for (let i = 0; i < peaks.length; i++) {
      if (!isOverlapping[i]) {
        uniquePeaks.push(peaks[i]);
      }
    }

    return uniquePeaks;
  }

  /**
   * Helper method to check if two peaks intersect
   */
  private static peaksIntersect(
    p1: Peak,
    p2: Peak,
    data: TimeSeriesData,
    dateIndices: Map<Date, number>,
  ): boolean {
    const p1PeakIdx = Search.getDateIndex(p1.getDate(), data, dateIndices);
    const p2PeakIdx = Search.getDateIndex(p2.getDate(), data, dateIndices);
    const p1StartIdx = Search.getDateIndex(p1.getStart(), data, dateIndices);
    const p1EndIdx = Search.getDateIndex(p1.getEnd(), data, dateIndices);
    const p2StartIdx = Search.getDateIndex(p2.getStart(), data, dateIndices);
    const p2EndIdx = Search.getDateIndex(p2.getEnd(), data, dateIndices);

    return (
      (p1PeakIdx <= p2EndIdx && p1PeakIdx >= p2StartIdx) ||
      (p2PeakIdx <= p1EndIdx && p2PeakIdx >= p1StartIdx)
    );
  }

  /**
   * Helper method to get date index with caching
   */
  private static getDateIndex(
    date: Date,
    data: TimeSeriesData,
    dateIndices: Map<Date, number>,
  ): number {
    if (dateIndices.has(date)) {
      return dateIndices.get(date)!;
    }
    const idx = Utils.findDateIdx(date, data);
    dateIndices.set(date, idx);
    return idx;
  }

  /**
   * Function to find the end of a peak. Move forwards from the peak until the
   * gradient stops being mostly negative.
   */
  private static searchPeakEnd(idx: number, norm: number[]): number {
    let end = idx;
    let gradientCount = 0;
    let negativeGradientCount = 0;

    // Move forward from the peak, tracking gradient changes
    for (let i = idx + 1; i < norm.length - 1; i++) {
      const gradient = norm[i + 1] - norm[i];
      gradientCount++;
      if (gradient < 0) {
        negativeGradientCount++;
      }

      // If we've seen enough gradients and most are negative, we've found the end
      if (gradientCount >= 3 && negativeGradientCount / gradientCount < 0.5) {
        break;
      }
      end = i;
    }

    return end;
  }

  /**
   * Function to find the start of a peak. Move backward from the peak until the
   * gradient stops being mostly negative.
   */
  private static searchPeakStart(idx: number, norm: number[]): number {
    let start = idx;
    let gradientCount = 0;
    let negativeGradientCount = 0;

    // Move backward from the peak, tracking gradient changes
    for (let i = idx - 1; i > 0; i--) {
      const gradient = norm[i] - norm[i - 1];
      gradientCount++;
      if (gradient < 0) {
        negativeGradientCount++;
      }

      // If we've seen enough gradients and most are negative, we've found the start
      if (gradientCount >= 3 && negativeGradientCount / gradientCount < 0.5) {
        break;
      }
      start = i;
    }

    return start;
  }

  /**
   * Function to find maximum points based on height difference between window
   * midpoint and edges.
   */
  private static searchMaxes(data: TimeSeriesData, window: number): number[] {
    const maxes: number[] = [];
    const halfWindow = Math.floor(window / 2);

    // Iterate through the data, checking each potential peak
    for (let i = halfWindow; i < data.length - halfWindow; i++) {
      const midY = data[i].y ?? 0;
      let isTaller = true;

      // Check if the midpoint is higher than all points in the window
      for (let j = i - halfWindow; j <= i + halfWindow; j++) {
        if (j !== i && (data[j].y ?? 0) >= midY) {
          isTaller = false;
          break;
        }
      }

      if (isTaller) {
        maxes.push(i);
      }
    }

    return maxes;
  }

  /**
   * The function search slopes in a given timeseries.
   * The steps involve iterating through the time series data using a sliding
   * window approach with the specified window size and calculates the slopes for
   * each window.
   */
  public static searchSlopes(
    data: TimeSeriesData,
    rank: number,
    metric: string,
    window: number,
  ): Slope[] {
    const slopes: Slope[] = [];

    for (let i = 0; i < data.length - window; i++) {
      // Calculate the slope for the current window
      const x1 = i;
      const x2 = i + window;
      const y1 = data[x1].y ?? 0;
      const y2 = data[x2].y ?? 0;

      // Calculate slope using the formula: (y2 - y1) / (x2 - x1)
      const slope = (y2 - y1) / window;

      // Create a Slope object with the calculated data
      const slopeObj = new Slope()
        .setDate(data[i + Math.floor(window / 2)].date)
        .setStart(data[i].date)
        .setEnd(data[i + window].date)
        .setSlope(slope)
        .setRank(rank)
        .setMetric(metric);

      slopes.push(slopeObj);
    }

    return slopes;
  }

  /**
   * Fall detection function.
   *   Using a window size of 20 we count the number of negative gradients.
   *   If this number is above a threshold we keep sliding the window.
   *   Once our bool fails we save segment in falls array and continue searching.
   */
  public static searchFalls(data: TimeSeriesData, metric: string = ''): Fall[] {
    const falls: Fall[] = [];
    const windowSize = 20;
    const threshold = 0.7; // 70% of gradients must be negative to be considered a fall

    let inFall = false;
    let fallStart = 0;
    let fallEnd = 0;

    // Iterate through the data with a sliding window
    for (let i = 0; i < data.length - windowSize; i++) {
      let negativeGradientCount = 0;

      // Count negative gradients in the current window
      for (let j = i; j < i + windowSize - 1; j++) {
        const gradient = (data[j + 1].y ?? 0) - (data[j].y ?? 0);
        if (gradient < 0) {
          negativeGradientCount++;
        }
      }

      // Calculate the proportion of negative gradients
      const negativeGradientProportion =
        negativeGradientCount / (windowSize - 1);

      // If we're not in a fall and we find a window with enough negative gradients, start a fall
      if (!inFall && negativeGradientProportion >= threshold) {
        inFall = true;
        fallStart = i;
      }
      // If we're in a fall and the window no longer has enough negative gradients, end the fall
      else if (inFall && negativeGradientProportion < threshold) {
        inFall = false;
        fallEnd = i + windowSize - 1;

        // Create a Fall object and add it to the result array
        const midPointIdx = Math.floor((fallStart + fallEnd) / 2);
        const midPointDate = data[midPointIdx].date;
        const midPointHeight = data[midPointIdx].y ?? 0;

        const fall = new Fall(
          midPointDate,
          midPointHeight,
          0, // rank
          metric,
          data[fallStart].date,
          data[fallEnd].date,
        );

        falls.push(fall);
      }
    }

    // If we're still in a fall at the end of the data, end it
    if (inFall) {
      fallEnd = data.length - 1;

      // Create a Fall object and add it to the result array
      const midPointIdx = Math.floor((fallStart + fallEnd) / 2);
      const midPointDate = data[midPointIdx].date;
      const midPointHeight = data[midPointIdx].y ?? 0;

      const fall = new Fall(
        midPointDate,
        midPointHeight,
        0, // rank
        metric,
        data[fallStart].date,
        data[fallEnd].date,
      );

      falls.push(fall);
    }

    return falls;
  }

  /**
   * Rise detection function.
   * Using a window size of 20 we count the number of positive gradients.
   * If this number is above a threshold we keep sliding the window.
   * Once our bool fails we save segment in rises array and continue searching.
   */
  public static searchRises(data: TimeSeriesData, metric: string = ''): Rise[] {
    const rises: Rise[] = [];
    const windowSize = 20;
    const threshold = 0.7; // 70% of gradients must be positive to be considered a rise

    let inRise = false;
    let riseStart = 0;
    let riseEnd = 0;

    // Iterate through the data with a sliding window
    for (let i = 0; i < data.length - windowSize; i++) {
      let positiveGradientCount = 0;

      // Count positive gradients in the current window
      for (let j = i; j < i + windowSize - 1; j++) {
        const gradient = (data[j + 1].y ?? 0) - (data[j].y ?? 0);
        if (gradient > 0) {
          positiveGradientCount++;
        }
      }

      // Calculate the proportion of positive gradients
      const positiveGradientProportion =
        positiveGradientCount / (windowSize - 1);

      // If we're not in a rise and we find a window with enough positive gradients, start a rise
      if (!inRise && positiveGradientProportion >= threshold) {
        inRise = true;
        riseStart = i;
      }
      // If we're in a rise and the window no longer has enough positive gradients, end the rise
      else if (inRise && positiveGradientProportion < threshold) {
        inRise = false;
        riseEnd = i + windowSize - 1;

        // Create a Rise object and add it to the result array
        const midPointIdx = Math.floor((riseStart + riseEnd) / 2);

        const rise = new Rise()
          .setDate(data[midPointIdx].date)
          .setHeight(data[midPointIdx].y ?? 0)
          .setRank(0)
          .setMetric(metric)
          .setStart(data[riseStart].date)
          .setEnd(data[riseEnd].date);

        rises.push(rise);
      }
    }

    // If we're still in a rise at the end of the data, end it
    if (inRise) {
      riseEnd = data.length - 1;

      // Create a Rise object and add it to the result array
      const midPointIdx = Math.floor((riseStart + riseEnd) / 2);

      const rise = new Rise()
        .setDate(data[midPointIdx].date)
        .setHeight(data[midPointIdx].y ?? 0)
        .setRank(0)
        .setMetric(metric)
        .setStart(data[riseStart].date)
        .setEnd(data[riseEnd].date);

      rises.push(rise);
    }

    return rises;
  }

  /**
   * Given a list of numbers, find the local minimum and maximum data points.
   * Example usage:
   * const [localMin, localMax] =
   * findLocalMinMax(data, "mean_test_accuracy");
   */
  public static findLocalMinMax(input: any[], key: string, window = 2): any {
    if (!input || input.length === 0) {
      return [[], []];
    }

    // Function to compare two numbers
    const compare = (a: number, b: number): number => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    // Extract values for the specified key
    const values = input.map((item) => item[key]);

    // Find local minima and maxima
    const localMin: any[] = [];
    const localMax: any[] = [];

    for (let i = window; i < values.length - window; i++) {
      const current = values[i];
      let isMin = true;
      let isMax = true;

      // Check if the current point is a local minimum or maximum
      for (let j = i - window; j <= i + window; j++) {
        if (i === j) continue;

        const comparison = compare(current, values[j]);

        // If current > any neighbor, it's not a minimum
        if (comparison > 0) isMin = false;

        // If current < any neighbor, it's not a maximum
        if (comparison < 0) isMax = false;

        // If it's neither a min nor max, no need to check further
        if (!isMin && !isMax) break;
      }

      // Add to the appropriate array if it's a local min or max
      if (isMin) localMin.push(input[i]);
      if (isMax) localMax.push(input[i]);
    }

    return [localMin, localMax];
  }

  /**
   * The function search global max in a given timeseries.
   */
  public static searchGlobalMax(
    data: TimeSeriesData,
    rank: number,
    metric: string,
  ): Max[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Find the index of the maximum value
    const maxIdx = Utils.maxIndex(data, (d) => d.y ?? 0);

    // Create a Max object with the maximum value
    const max = new Max()
      .setDate(data[maxIdx].date)
      .setHeight(data[maxIdx].y ?? 0)
      .setRank(rank)
      .setMetric(metric);

    return [max];
  }

  /**
   * The function search global min in a given timeseries.
   */
  public static searchGlobalMin(
    data: TimeSeriesData,
    rank: number,
    metric: string,
  ): Min[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Find the index of the minimum value
    const minIdx = Utils.minIndex(data, (d) => d.y ?? 0);

    // Create a Min object with the minimum value
    const min = new Min()
      .setDate(data[minIdx].date)
      .setHeight(data[minIdx].y ?? 0)
      .setRank(rank)
      .setMetric(metric);

    return [min];
  }

  /**
   * The function returns first data point
   */
  public static searchFirst(
    data: TimeSeriesData,
    rank: number,
    metric: string,
  ): Min[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Create a Min object with the first data point
    const min = new Min()
      .setDate(data[0].date)
      .setHeight(data[0].y ?? 0)
      .setRank(rank)
      .setMetric(metric);

    return [min];
  }

  /**
   * The function returns current data points.
   */
  public static searchCurrent(
    data: TimeSeriesData,
    rank: number,
    metric: string,
  ): Min[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Create a Current object with the last data point
    const current = new Current()
      .setDate(data[data.length - 1].date)
      .setHeight(data[data.length - 1].y ?? 0)
      .setRank(rank)
      .setMetric(metric);

    return [current];
  }

  /**
   * The function last data point
   */
  public static searchLast(
    data: TimeSeriesData,
    rank: number,
    metric: string,
  ): Min[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Create a Last object with the last data point
    const last = new Last()
      .setDate(data[data.length - 1].date)
      .setHeight(data[data.length - 1].y ?? 0)
      .setRank(rank)
      .setMetric(metric);

    return [last];
  }

  /**
   * Finds the numerical feature for a given date from a list of numerical features.
   * @param features - Array of NumericalFeature objects
   * @param date - The date to search for (Date object)
   * @returns The NumericalFeature for the given date, or undefined if not found
   */
  public static findNumericalFeatureByDate(
    features: NumericalFeature[],
    date: Date,
  ): NumericalFeature | undefined {
    return features.find(
      (feature) => feature.getDate().toDateString() === date.toDateString(),
    );
  }

  /**
   * Finds the categorical feature for a given date from a list of categorical features.
   * @param features - Array of CategoricalFeature objects
   * @param date - The date to search for (Date object)
   * @returns The CategoricalFeature for the given date, or undefined if not found
   */
  public static findCategoricalFeatureByDate(
    features: CategoricalFeature[],
    date: Date,
  ): CategoricalFeature | undefined {
    return features.find(
      (feature) => feature.getDate().toDateString() === date.toDateString(),
    );
  }

  /**
   *  --- The following functions are used to find the closest feature to a given date ---
   *  --- Mainly used after gaussian and segmentation ---
   */

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
  public static findClosestCategoricalFeature(
    features: CategoricalFeature[],
    date: Date,
    maxDaysDifference: number = 3,
  ): CategoricalFeature | undefined {
    // 1. Try to find an exact match
    const exactMatch = features.find(
      (feature) => feature.getDate().toDateString() === date.toDateString(),
    );
    if (exactMatch) return exactMatch;

    // 2. Find all features within maxDaysDifference
    const targetTime = date.getTime();
    let minDaysDifference = Number.MAX_SAFE_INTEGER;
    let candidates: CategoricalFeature[] = [];

    for (const feature of features) {
      const featureTime = feature.getDate().getTime();
      const daysDifference =
        Math.abs(featureTime - targetTime) / (1000 * 60 * 60 * 24);
      if (daysDifference <= maxDaysDifference) {
        if (daysDifference < minDaysDifference) {
          minDaysDifference = daysDifference;
          candidates = [feature];
        } else if (daysDifference === minDaysDifference) {
          candidates.push(feature);
        }
      }
    }

    if (candidates.length === 0) return undefined;
    if (candidates.length === 1) return candidates[0];

    // 3. If multiple candidates, pick the one with closest rank (to the target date's rank if available)
    // Assume rank 0 if not set on target date
    let targetRank = 0;
    // Try to find a feature on the target date to get its rank
    const targetFeature = features.find(
      (feature) => feature.getDate().toDateString() === date.toDateString(),
    );
    if (targetFeature && typeof (targetFeature as any).getRank === 'function') {
      targetRank = (targetFeature as any).getRank();
    }
    // Otherwise, use the minimum rank difference
    let minRankDiff = Number.MAX_SAFE_INTEGER;
    let closestByRank = candidates[0];
    for (const feature of candidates) {
      let rank =
        typeof (feature as any).getRank === 'function'
          ? (feature as any).getRank()
          : 0;
      const rankDiff = Math.abs(rank - targetRank);
      if (rankDiff < minRankDiff) {
        minRankDiff = rankDiff;
        closestByRank = feature;
      }
    }
    return closestByRank;
  }

  /**
   * Finds the numerical feature closest to a given date from a list of numerical features.
   * If an exact match is found, it returns that feature. Otherwise, it returns the feature
   * with the closest date within a specified maximum difference (in days). If there are multiple
   * candidates at the same minimum date distance, use the one with the closest rank.
   *
   * @param features - Array of NumericalFeature objects
   * @param date - The date to search for (Date object)
   * @param maxDaysDifference - Maximum allowed difference in days (default: 3)
   * @returns The closest NumericalFeature, or undefined if none found within the allowed range
   */
  public static findClosestNumericalFeature(
    features: NumericalFeature[],
    date: Date,
    maxDaysDifference: number = 3,
  ): NumericalFeature | undefined {
    // 1. Try to find an exact match
    const exactMatch = features.find(
      (feature) => feature.getDate().toDateString() === date.toDateString(),
    );
    if (exactMatch) return exactMatch;

    // 2. Find all features within maxDaysDifference
    const targetTime = date.getTime();
    let minDaysDifference = Number.MAX_SAFE_INTEGER;
    let candidates: NumericalFeature[] = [];

    for (const feature of features) {
      const featureTime = feature.getDate().getTime();
      const daysDifference =
        Math.abs(featureTime - targetTime) / (1000 * 60 * 60 * 24);
      if (daysDifference <= maxDaysDifference) {
        if (daysDifference < minDaysDifference) {
          minDaysDifference = daysDifference;
          candidates = [feature];
        } else if (daysDifference === minDaysDifference) {
          candidates.push(feature);
        }
      }
    }

    if (candidates.length === 0) return undefined;
    if (candidates.length === 1) return candidates[0];

    // 3. If multiple candidates, pick the one with closest rank (to the target date's rank if available)
    let targetRank = 0;
    const targetFeature = features.find(
      (feature) => feature.getDate().toDateString() === date.toDateString(),
    );
    if (targetFeature && typeof (targetFeature as any).getRank === 'function') {
      targetRank = (targetFeature as any).getRank();
    }
    let minRankDiff = Number.MAX_SAFE_INTEGER;
    let closestByRank = candidates[0];
    for (const feature of candidates) {
      let rank =
        typeof (feature as any).getRank === 'function'
          ? (feature as any).getRank()
          : 0;
      const rankDiff = Math.abs(rank - targetRank);
      if (rankDiff < minRankDiff) {
        minRankDiff = rankDiff;
        closestByRank = feature;
      }
    }
    return closestByRank;
  }

  /**
   * Finds the closest feature (categorical or numerical) to a given date.
   * Returns the closest feature (by date) among all categorical and numerical features.
   *
   * @param categoricalFeatures - Array of CategoricalFeature objects
   * @param numericalFeatures - Array of NumericalFeature objects
   * @param date - The date to search for (Date object)
   * @param maxDaysDifference - Maximum allowed difference in days (default: 3)
   * @returns The closest feature (CategoricalFeature | NumericalFeature), or undefined if none found within the allowed range
   */
  public static findClosestFeature(
    categoricalFeatures: CategoricalFeature[],
    numericalFeatures: NumericalFeature[],
    date: Date,
    maxDaysDifference: number = 3,
  ): CategoricalFeature | NumericalFeature | undefined {
    const closestCat = Search.findClosestCategoricalFeature(
      categoricalFeatures,
      date,
      maxDaysDifference,
    );
    const closestNum = Search.findClosestNumericalFeature(
      numericalFeatures,
      date,
      maxDaysDifference,
    );

    if (!closestCat && !closestNum) return undefined;
    if (closestCat && !closestNum) return closestCat;
    if (!closestCat && closestNum) return closestNum;

    // Both exist: compare which is closer in date
    const catDiff = Math.abs(closestCat!.getDate().getTime() - date.getTime());
    const numDiff = Math.abs(closestNum!.getDate().getTime() - date.getTime());

    return catDiff <= numDiff ? closestCat : closestNum;
  }
}
