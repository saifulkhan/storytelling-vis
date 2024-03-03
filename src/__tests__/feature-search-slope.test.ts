import { searchSlopes } from "src/utils/storyboards/feature/feature-search";
import { TimeseriesDataType } from "src/utils/storyboards/processing/TimeseriesDataType";

describe("searchSlopes", () => {
  it("should calculate slopes for time series with date and number pairs", () => {
    const data: TimeseriesDataType[] = [
      { date: new Date("2023-01-01"), y: 10 },
      { date: new Date("2023-01-02"), y: 15 },
      { date: new Date("2023-01-03"), y: 20 },
      { date: new Date("2023-01-04"), y: 25 },
      { date: new Date("2023-01-05"), y: 30 },
    ];
    const window = 3;
    const expected = [5, 5, 5]; // Expected slopes based on the input

    const result = searchSlopes(data, window);
    expect(result.map((d) => d.slope)).toEqual(expected);
  });

  it("should calculate slopes for time series with negative slopes", () => {
    const data: TimeseriesDataType[] = [
      { date: new Date("2023-01-01"), y: 100 },
      { date: new Date("2023-01-02"), y: 80 },
      { date: new Date("2023-01-03"), y: 60 },
      { date: new Date("2023-01-04"), y: 40 },
      { date: new Date("2023-01-05"), y: 20 },
    ];
    const window = 3;
    const expected = [-20, -20, -20]; // Expected slopes based on the input

    const result = searchSlopes(data, window);
    expect(result.map((d) => d.slope)).toEqual(expected);
  });

  it("should calculate slopes for irregular time series with varying window sizes", () => {
    const data: TimeseriesDataType[] = [
      { date: new Date("2023-02-01"), y: 10 },
      { date: new Date("2023-02-03"), y: 20 },
      { date: new Date("2023-02-07"), y: 15 },
      { date: new Date("2023-02-10"), y: 25 },
      { date: new Date("2023-02-15"), y: 30 },
    ];
    const window = 4;
    const expected = [5, -1.6666666666666667, 1.25]; // Expected slopes based on the input

    const result = searchSlopes(data, window);
    expect(result.map((d) => d.slope)).toEqual(expected);
  });

  it("should calculate slopes for larger time series with varying window sizes", () => {
    const data: TimeseriesDataType[] = [
      { date: new Date("2023-03-01"), y: 50 },
      { date: new Date("2023-03-03"), y: 40 },
      { date: new Date("2023-03-05"), y: 30 },
      { date: new Date("2023-03-08"), y: 20 },
      { date: new Date("2023-03-10"), y: 10 },
      { date: new Date("2023-03-12"), y: 5 },
      { date: new Date("2023-03-15"), y: 15 },
      { date: new Date("2023-03-18"), y: 25 },
      { date: new Date("2023-03-20"), y: 35 },
    ];
    const window = 5;
    const expected = [-2, -2, -2, -2, 0, 2, 2]; // Expected slopes based on the input

    const result = searchSlopes(data, window);
    expect(result.map((d) => d.slope)).toEqual(expected);
  });
});
