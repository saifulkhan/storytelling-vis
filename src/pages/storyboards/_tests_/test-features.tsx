import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { schemeTableau10 } from "d3-scale-chromatic";

import { covid19data1 } from "src/services/covid19-data";
import {
  LineChart,
  LineProperties,
} from "src/components/storyboards/plots/LineChart";
import { Dot } from "src/components/storyboards/actions/Dot";
import { searchPeaks } from "src/utils/storyboards/feature/feature-search";
import { sliceTimeseriesByDate } from "src/utils/storyboards/processing/common";
import { Peak } from "src/utils/storyboards/feature/Peak";
import { TimeseriesDataType } from "src/utils/storyboards/processing/TimeseriesDataType";

const TestFeatures = () => {
  const chartRef = useRef(null);

  const height = 550;
  const width = 1500;

  useEffect(() => {
    if (!chartRef.current) return;
    console.log("useEffect triggered");

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .node();

    console.log("svg = ", svg);

    covid19data1().then((d) => {
      const data: TimeseriesDataType[] = d["Aberdeenshire"];
      console.log("TestFeatures: data = ", data);

      const peaks: Peak[] = searchPeaks(data, "cases/day", 10);
      console.log("TestFeatures: peaks = ", peaks);

      const peaksData = peaks.map((peak) =>
        sliceTimeseriesByDate(data, peak.start, peak.end),
      );

      peaksData.unshift(data);
      console.log("TestFeatures: peaksData = ", peaksData);

      const plot = new LineChart()
        .data(peaksData)
        .chartProperties({})
        .lineProperties(
          peaksData.map((d, i) => {
            return {
              stroke: schemeTableau10[i],
            } as LineProperties;
          }),
        )
        .svg(svg)
        .draw();

      peaks.forEach((peak) => {
        console.log(...plot.coordinates(0, peak.date));
        new Dot()
          .properties()
          .svg(svg)
          .draw()
          .coordinate(...plot.coordinates(0, peak.date));
      });
    });
  }, []);

  return (
    <>
      <svg
        ref={chartRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid",
        }}
      ></svg>
    </>
  );
};

export default TestFeatures;
