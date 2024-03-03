import { TimeseriesType } from "src/utils/storyboards/TimeseriesType";
import { readCSVFile } from "./data";

export async function covid19data1() {
  const DATA = "/static/storyboards/newCasesByPublishDateRollingSum.csv";
  const csv: any[] = await readCSVFile(DATA);
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
      (e1: TimeseriesType, e2: TimeseriesType) =>
        e1.date.getTime() - e2.date.getTime(),
    );
  }

  return data;
}
