import * as d3 from "d3";
import { TimeSeriesPoint } from "src/types/TimeSeriesPoint";

// Basic CSV and JSON reader and writer
export const readCSV = async (file: string): Promise<d3.DSVRowArray<string>> => {
  try {
    const result = await d3.csv(file);
    if (!result) throw new Error(`Failed to load CSV file: ${file}`);
    return result;
  } catch (e) {
    console.error("Error loading the CSV file: ", e);
    throw e;
  }
};

export const readJSON = async <T>(file: string): Promise<T> => {
  try {
    const result = await d3.json<T>(file);
    if (!result) throw new Error(`Failed to load JSON file: ${file}`);
    return result;
  } catch (e) {
    console.error("Error loading the JSON file:", e);
    throw e;
  }
};

export async function getCovid19Data() {

  const FILE = "/static/data/covid19/newCasesByPublishDateRollingSum.csv";
  //"/home/vlq26735/VIS4ML4HD/meta-storyboard/storytelling-vis/src/pages/services/data/covid19/newCasesByPublishDateRollingSum.csv";

  try {
    const csv = await readCSV(FILE);
    const data: {
      [key: string]: TimeSeriesPoint[];
    } = {};

    csv.forEach((row: d3.DSVRowString<string>) => {
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
        (e1: TimeSeriesPoint, e2: TimeSeriesPoint) =>
          e1.date.getTime() - e2.date.getTime()
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to get COVID-19 data:", error);
    return {};
  }
}

export async function getMLData() {
  const FILE = "/static/data/ml/data.csv";

  try {
    const csv = await readCSV(FILE);
    const data: TimeSeriesPoint[] = [];

    // convert string to number and date
    csv.forEach((row: d3.DSVRowString<string>) => {
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

    const dataJSON = JSON.stringify(data, null, 2);
    const blob = new Blob([dataJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ml-training-data.json";
    a.click();
    document.body.appendChild(a);
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return data;
  } catch (error) {
    console.error("Failed to get ML data:", error);
    return [];
  }
}
