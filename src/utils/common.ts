import * as d3 from "d3";
import { TimeSeriesPoint, TimeSeriesData } from "../types/TimeSeriesPoint";

export function mean(data: number[]): number {
  return data.reduce((acc, val) => acc + val, 0) / data.length;
}

export function sortTimeseriesData(
  data: TimeSeriesData,
  key: keyof TimeSeriesPoint
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
    .sort((a, b) => d3.ascending(a["date"], b["date"]));
}

export function sliceTimeseriesByDate(
  data: TimeSeriesData,
  start: Date,
  end: Date
): TimeSeriesData {
  return data.filter((item) => item.date >= start && item.date <= end);
}

interface FilterCondition {
  (obj: any): boolean;
}

export function createPredicate(
  predicateString: string
): FilterCondition | null {
  try {
    // wrapping the predicateString in a function and returning the predicate function
    const predicateFunction = new Function(
      "obj",
      `return ${predicateString};`
    ) as FilterCondition;
    return predicateFunction;
  } catch (error) {
    console.error("Error creating predicate function:", error);
    return null;
  }
}

/**
 **  Function to find index of a date in the timeseries data
 **/

export function findDateIdx(date: Date, data: TimeSeriesData): number {
  return data.findIndex((d) => d.date.getTime() == date.getTime());
}

export function findIndexOfDate(data: TimeSeriesData, date: Date): number {
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

export function getTimeSeriesPointByDate(
  date: Date,
  data: TimeSeriesData
): TimeSeriesPoint | undefined {
  const idx = findDateIdx(date, data);
  return data[idx];
}

/**
 **  Function to find indices of dates in the time series data
 **/
export function findIndicesOfDates(
  data: TimeSeriesData,
  dates: Date[]
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
 ** Function to set a value in the map if it doesn't exist, otherwise get the existing value and then set it again
 **/
export function setOrUpdateMap<K, V>(
  map: Map<K, V[] | Array<V>>,
  key: K,
  value: V
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

export function sortObjectKeysInPlace<T extends Record<string, any>>(
  obj: T
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

export function getObjectKeysArray(obj: any[]): string[] {
  // function to check if a value is an object
  const isObject = (value: unknown): boolean => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  };

  // ensure the array is not empty and contains objects
  if (!Array.isArray(obj) || obj.length === 0 || !isObject(obj[0])) {
    return [];
  }

  // extract keys from the first object
  const keys = Object.keys(obj[0]);
  return keys;
}

export function maxIndex<T>(
  values: Iterable<T>,
  valueof?: (
    value: T,
    index: number,
    array: Iterable<T>
  ) => number | null | undefined
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

export function minIndex<T>(
  values: Iterable<T>,
  valueof?: (
    value: T,
    index: number,
    array: Iterable<T>
  ) => number | null | undefined
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

/*
 * Min-Max normalization of data of the form [x0, x1, ...xn]
 */
export function normalise(data: number[]) {
  // get min and max values from data (for normalization)
  const [min, max] = data
    .slice(1)
    .reduce(
      (res, d) => [Math.min(d, res[0]), Math.max(d, res[1])],
      [data[0], data[0]]
    );

  // normalise y values to be between 0 and 1
  return data.map((d) => (d - min) / (max - min));
}

export function scaleValue(
  value: number,
  minInput: number,
  maxInput: number,
  minOutput: number,
  maxOutput: number
): number {
  return (
    ((value - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) +
    minOutput
  );
}