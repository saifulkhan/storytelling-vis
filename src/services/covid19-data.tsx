import { TimeseriesData } from "../utils/storyboards/data-processing/TimeseriesData";
import { readCSV } from "./data";

export async function covid19data() {
  const DATA = "/static/storyboards/newCasesByPublishDateRollingSum.csv";
  const csv: any[] = await readCSV(DATA);
  const data = {};

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

  // console.log("data: ", data);

  return data;
}
