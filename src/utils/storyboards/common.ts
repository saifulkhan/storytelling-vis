import * as d3 from "d3";
import {
  MLTimeseriesData,
  TimeseriesData,
} from "./data-processing/TimeseriesData";

export function mean(data: number[]): number {
  return data.reduce((acc, val) => acc + val, 0) / data.length;
}

export function sliceTimeseriesByDate(
  data: TimeseriesData[],
  start: Date,
  end: Date
): TimeseriesData[] {
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

export function findDateIdx(date: Date, data: TimeseriesData[]): number {
  return data.findIndex((d) => d.date.getTime() == date.getTime());
}

export function findIndexOfDate(data: TimeseriesData[], date: Date): number {
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
 **  Function to find indices of dates in the time series data
 **/
export function findIndicesOfDates(
  data: TimeseriesData[],
  dates: Date[]
): number[] {
  const indices: number[] = [];

  // iterate through the time series data
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
export function setOrUpdateMap(
  map: Map<unknown, unknown>,
  key: unknown,
  value: unknown[] | unknown
) {
  if (map.has(key)) {
    const existingValue = map.get(key);
    existingValue?.push(value);
    map.set(key, existingValue!);
  } else {
    map.set(key, [value]);
  }
}

export function sortObjectKeysInPlace(obj) {
  let keys = Object.keys(obj);
  keys.sort();
  let sortedObj = {};
  keys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  // Reassign the sorted keys to the original object
  Object.keys(sortedObj).forEach((key) => {
    obj[key] = sortedObj[key];
  });
  return obj; // Optional: Return the sorted object
}

export function getObjectKeysArray(obj: any[]): string[] {
  // function to check if a value is an object
  const isObject = (value) => {
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

export function maxIndex(values, valueof?) {
  let max;
  let maxIndex = -1;
  let index = -1;
  if (valueof === undefined) {
    for (const value of values) {
      ++index;
      if (
        value != null &&
        (max < value || (max === undefined && value >= value))
      ) {
        (max = value), (maxIndex = index);
      }
    }
  } else {
    for (let value of values) {
      if (
        (value = valueof(value, ++index, values)) != null &&
        (max < value || (max === undefined && value >= value))
      ) {
        (max = value), (maxIndex = index);
      }
    }
  }
  return maxIndex;
}

export function minIndex(values, valueof?) {
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

/*
 * Linear regression function inspired by the answer found at: https://stackoverflow.com/a/31566791.
 * We remove the need for array x as we assume y data is equally spaced and we only want the gradient.
 */

export function linRegGrad(y) {
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

export function fromMLToTimeSeriesData(
  data: MLTimeseriesData[],
  key: string
): TimeseriesData[] {
  return data.map((d: MLTimeseriesData) => {
    return {
      date: d.date,
      y: d[key],
    };
  });
}

export function clean(svg: SVGGElement) {
  d3.select(svg).selectAll("*").remove();
}
