import * as d3 from "d3";
import {
  MLTimeseriesData,
  TimeseriesData,
} from "../utils/storyboards/data-processing/TimeseriesData";

export async function getCovid19Data() {
  const FILE =
    "/static/storyboards/covid19/newCasesByPublishDateRollingSum.csv";

  const csv: any[] = await readCSV(FILE);
  const data: {
    [key: string]: TimeseriesData[];
  } = {};

  csv.forEach((row) => {
    const region = row.areaName;
    const date = new Date(row.date);
    const cases = +row.newCasesByPublishDateRollingSum;

    if (!data[region]) {
      data[region] = [];
    }

    data[region].push({ date: date, y: cases });
  });

  for (const region in data) {
    data[region].sort(
      (e1: TimeseriesData, e2: TimeseriesData) =>
        e1.date.getTime() - e2.date.getTime()
    );
  }

  return data;
}

export async function getMLData() {
  const FILE = "/static/storyboards/ml/data.csv";

  const csv: any[] = await readCSV(FILE);
  const data: MLTimeseriesData[] = [];

  // convert string to number and date
  csv.forEach((row) => {
    data.push({
      date: new Date(row.date),
      mean_test_accuracy: +row.mean_test_accuracy,
      mean_training_accuracy: +row.mean_training_accuracy,
      channels: +row.channels,
      kernel_size: +row.kernel_size,
      layers: +row.layers,
      samples_per_class: +row.samples_per_class,
    });
  });

  return data;
}

//
// Basic CSV and JSON reader and writer
//

export const readCSV = async (file: string) => {
  try {
    return await d3.csv(file);
  } catch (e) {
    console.error("Error loading the CSV file: ", e);
  }
};

export const readJSON = async (file: string) => {
  try {
    return await d3.json(file);
  } catch (e) {
    console.error("Error loading the JSON file:", e);
  }
};
