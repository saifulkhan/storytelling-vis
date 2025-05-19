import * as d3 from 'd3';
import { TimeSeriesPoint, TimeSeriesData } from '../types';
import { Peak } from '../feature/Peak';
import { Segment } from '../types';
import { Search } from './Search';

/**
 * Utils class containing static utility methods for time series data processing,
 * segmentation, and ranking functions.
 */
export class Utils {
  /* Rank used between 0 and MAX_RANK */
  private static readonly MAX_RANK = 10;

  /**
   * Calculates the mean of an array of numbers
   */
  public static mean(data: number[]): number {
    return data.reduce((acc, val) => acc + val, 0) / data.length;
  }

  /**
   * Sorts time series data by a specified key and ensures date order
   */
  public static sortTimeseriesData(
    data: TimeSeriesData,
    key: keyof TimeSeriesPoint,
  ): TimeSeriesData {
    // sort data by selected key, e.g, "kernel_size"
    return data
      .slice()
      .map((item) => {
        // Ensure the y property is populated for compatibility with TimeseriesData
        // Use mean_test_accuracy as the default value for y if it's not already set
        if (item.y === undefined) {
          item.y = item.mean_test_accuracy;
        }
        return item;
      })
      .sort((a, b) => d3.ascending(a[key], b[key]))
      .sort((a, b) => d3.ascending(a['date'], b['date']));
  }

  /**
   * Slices time series data between two dates
   */
  public static sliceTimeseriesByDate(
    data: TimeSeriesData,
    start: Date,
    end: Date,
  ): TimeSeriesData {
    return data.filter((item) => item.date >= start && item.date <= end);
  }

  /**
   * Creates a predicate function from a string
   */
  public static createPredicate(
    predicateString: string,
  ): ((obj: any) => boolean) | null {
    try {
      // wrapping the predicateString in a function and returning the predicate function
      const predicateFunction = new Function(
        'obj',
        `return ${predicateString};`,
      ) as (obj: any) => boolean;
      return predicateFunction;
    } catch (error) {
      console.error('Error creating predicate function:', error);
      return null;
    }
  }

  /**
   * Finds the index of a date in time series data
   */
  public static findDateIdx(date: Date, data: TimeSeriesData): number {
    return data.findIndex((d) => d.date.getTime() == date.getTime());
  }

  /**
   * Finds the index of a date in time series data (alternative implementation)
   */
  public static findIndexOfDate(data: TimeSeriesData, date: Date): number {
    return data.findIndex((d) => {
      for (const key in d) {
        if (
          d.hasOwnProperty(key) &&
          d[key] instanceof Date &&
          d[key].getTime() === date.getTime()
        ) {
          return true;
        }
      }
      return false;
    });
  }

  /**
   * Gets a time series point by date
   */
  public static getTimeSeriesPointByDate(
    date: Date,
    data: TimeSeriesData,
  ): TimeSeriesPoint | undefined {
    const idx = Utils.findDateIdx(date, data);
    return data[idx];
  }

  /**
   * Finds indices of multiple dates in time series data
   */
  public static findIndicesOfDates(
    data: TimeSeriesData,
    dates: Date[],
  ): number[] {
    const indices: number[] = [];

    for (let i = 0; i < data.length; i++) {
      const currentDate = data[i].date;
      // check if the current date exists in the array of dates to find
      if (dates.some((date) => date.getTime() === currentDate.getTime())) {
        indices.push(i);
      }
    }
    return indices;
  }

  /**
   * Sets or updates a value in a map
   */
  public static setOrUpdateMap<K, V>(
    map: Map<K, V[] | Array<V>>,
    key: K,
    value: V,
  ): void {
    if (map.has(key)) {
      const existingValue = map.get(key);
      if (existingValue && Array.isArray(existingValue)) {
        existingValue.push(value);
        map.set(key, existingValue);
      }
    } else {
      map.set(key, [value]);
    }
  }

  /**
   * Sorts object keys in place
   */
  public static sortObjectKeysInPlace<T extends Record<string, any>>(
    obj: T,
  ): T {
    let keys = Object.keys(obj);
    keys.sort();
    let sortedObj: Record<string, any> = {};
    keys.forEach((key) => {
      sortedObj[key] = obj[key];
    });
    // Reassign the sorted keys to the original object
    Object.keys(sortedObj).forEach((key) => {
      (obj as Record<string, any>)[key] = sortedObj[key];
    });
    return obj;
  }

  /**
   * Gets an array of object keys
   */
  public static getObjectKeysArray(obj: any[]): string[] {
    // function to check if a value is an object
    const isObject = (value: unknown): boolean => {
      return (
        value !== null && typeof value === 'object' && !Array.isArray(value)
      );
    };

    // ensure the array is not empty and contains objects
    if (!Array.isArray(obj) || obj.length === 0 || !isObject(obj[0])) {
      return [];
    }

    // extract keys from the first object
    const keys = Object.keys(obj[0]);
    return keys;
  }

  /**
   * Finds the index of the maximum value in an iterable
   */
  public static maxIndex<T>(
    values: Iterable<T>,
    valueof?: (
      value: T,
      index: number,
      array: Iterable<T>,
    ) => number | null | undefined,
  ): number {
    let max: number | undefined;
    let maxIndex = -1;
    let index = -1;
    if (valueof === undefined) {
      for (const value of values) {
        ++index;
        const numValue = value as unknown as number;
        if (numValue != null && (max === undefined || max < numValue)) {
          max = numValue;
          maxIndex = index;
        }
      }
    } else {
      for (const item of values) {
        const value = valueof(item, ++index, values);
        if (value != null && (max === undefined || max < value)) {
          max = value;
          maxIndex = index;
        }
      }
    }
    return maxIndex;
  }

  /**
   * Finds the index of the minimum value in an iterable
   */
  public static minIndex<T>(
    values: Iterable<T>,
    valueof?: (
      value: T,
      index: number,
      array: Iterable<T>,
    ) => number | null | undefined,
  ): number {
    let min: number | undefined;
    let minIndex = -1;
    let index = -1;
    if (valueof === undefined) {
      for (const value of values) {
        ++index;
        const numValue = value as unknown as number;
        if (numValue != null && (min === undefined || min > numValue)) {
          min = numValue;
          minIndex = index;
        }
      }
    } else {
      for (const item of values) {
        const value = valueof(item, ++index, values);
        if (value != null && (min === undefined || min > value)) {
          min = value;
          minIndex = index;
        }
      }
    }
    return minIndex;
  }

  /**
   * Min-Max normalization of data of the form [x0, x1, ...xn]
   */
  public static normalise(data: number[]) {
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

  /**
   * Scales a value from one range to another
   */
  public static scaleValue(
    value: number,
    minInput: number,
    maxInput: number,
    minOutput: number,
    maxOutput: number,
  ): number {
    return (
      ((value - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) +
      minOutput
    );
  }

  /**
   * Assigns discrete ranks to an array of Peak objects based on their height.
   * Discrete, grouped ranks (good for categorical/bucketed analysis).
   */
  public static rankPeaksByHeight(peaks: Peak[]) {
    if (peaks.length === 0) return;
    // create a sorted copy for ranking
    const sorted = [...peaks].sort((p1, p2) => p1.getHeight() - p2.getHeight());
    const numPeaks = sorted.length;
    const groupSize = numPeaks / Utils.MAX_RANK;

    // map from Peak to its rank
    const peakToRank = new Map<Peak, number>();
    sorted.forEach((p: Peak, i: number) => {
      const rank = 1 + Math.floor(i / groupSize);
      peakToRank.set(p, rank);
    });

    // assign rank in original order
    peaks.forEach((p) => {
      p.setRank(peakToRank.get(p) || 1);
    });
  }

  /**
   * Assigns normalized height to an array of Peak objects based on their height.
   * Continuous, normalized values (good for smooth, relative comparisons).
   */
  public static setPeaksNormHeight(peaks: Peak[]) {
    if (peaks.length === 0) return;
    // create a sorted copy for normalization
    const sorted = [...peaks].sort((p1, p2) => p1.getHeight() - p2.getHeight());

    const maxValue = sorted[sorted.length - 1].getHeight();
    const minValue = sorted[0].getHeight();

    // map from Peak to its normalized height
    const peakToNorm = new Map<Peak, number>();
    sorted.forEach((p) => {
      peakToNorm.set(
        p,
        Utils.scaleValue(p.getHeight(), minValue, maxValue, 1, Utils.MAX_RANK),
      );
    });

    // assign normalized height in original order
    peaks.forEach((p) => {
      p.setNormHeight(peakToNorm.get(p) || 1);
    });
  }

  /**
   * Segments by the k most important peaks.
   */
  public static segmentByPeaks(data: TimeSeriesData, k: number): Segment[] {
    let peaks: Peak[] = Search.searchPeaks(data);
    Utils.setPeaksNormHeight(peaks);

    // create peaks with just index and height
    const peakIndices: { idx: number; h: number }[] = peaks.map((d: Peak) => ({
      idx: d.getDataIndex(),
      h: d.getNormHeight(),
    }));

    peakIndices.sort((a, b) => b.h - a.h);

    return peakIndices
      .slice(0, k - 1)
      .map((d) => ({ idx: d.idx, date: data[d.idx]?.date }));
  }

  /**
   * Segments a time series by identifying the k most important peaks with a minimum gap.
   */
  public static segmentByImportantPeaks(
    data: TimeSeriesData,
    k: number,
    deltaMax = 0.1,
  ): Segment[] {
    // Find and rank all peaks in the data
    let peaks: Peak[] = Search.searchPeaks(data);
    Utils.setPeaksNormHeight(peaks);
    const dataLength = data.length;

    // Create a simplified representation of peaks with just index and height
    const peakIndices: { idx: number; h: number }[] = peaks.map((d: Peak) => ({
      idx: d.getDataIndex(),
      h: d.getNormHeight(),
    }));

    const ordering: { idx: number; h: number }[] = [];

    while (peakIndices.length) {
      let bestPeak:
        | { valley: { idx: number; h: number }; idx: number; score: number }
        | undefined;

      peakIndices.forEach((v1, i) => {
        let closestDist = ordering.reduce(
          (closest, v2) => Math.min(closest, Math.abs(v1.idx - v2.idx)),
          Math.min(v1.idx, dataLength - v1.idx),
        );
        let score = (closestDist / dataLength) * (v1.h / 2);
        bestPeak =
          bestPeak && bestPeak.score > score
            ? bestPeak
            : { valley: v1, idx: i, score: score };
      });
      peakIndices.splice(bestPeak!.idx, 1);
      ordering.push(bestPeak!.valley);
    }

    return ordering
      .slice(0, k - 1)
      .map((d) => ({ idx: d.idx, date: data[d.idx]?.date }));
  }

  /**
   * Segments time series data by finding important peaks with a minimum distance constraint.
   * This function directly analyzes the time series data to find peaks, without requiring
   * pre-processing through the Peak class.
   */
  public static segmentByImportantPeaks1(
    data: TimeSeriesData,
    k: number,
    deltaMax = 0.1,
  ): Segment[] {
    if (k <= 1 || data.length === 0) {
      return [];
    }

    // Calculate the actual minimum distance in data points
    const minDistance = Math.ceil(deltaMax * data.length);

    // Calculate the prominence of each point (how much it stands out)
    const prominences: { index: number; value: number }[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      const current = data[i].y ?? 0;
      const prev = data[i - 1].y ?? 0;
      const next = data[i + 1].y ?? 0;

      // A point is a peak if it's higher than its neighbors
      if (current > prev && current > next) {
        // Calculate prominence (how much the peak stands out)
        // Simple way: how much higher the peak is compared to its neighbors
        const prominence = Math.min(current - prev, current - next);
        prominences.push({ index: i, value: prominence });
      }
    }

    // Sort peaks by prominence (highest first)
    prominences.sort((a, b) => b.value - a.value);

    // Select peaks with the distance constraint
    const selectedPeaks: number[] = [];

    for (const peak of prominences) {
      // Check if this peak is far enough from already selected peaks
      const isFarEnough = selectedPeaks.every(
        (selectedIndex) => Math.abs(peak.index - selectedIndex) >= minDistance,
      );

      if (isFarEnough) {
        selectedPeaks.push(peak.index);

        // Break once we have k-1 peaks
        if (selectedPeaks.length === k - 1) {
          break;
        }
      }
    }

    // Sort peaks by their position in the time series and map to objects with idx and date
    return selectedPeaks
      .sort((a, b) => a - b)
      .map((idx) => ({ idx, date: data[idx]?.date }));
  }
}
