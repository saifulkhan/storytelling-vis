import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { covid19data1 } from "src/services/covid19-data";
import { LineChart } from "src/components/storyboards/plots/LineChart";

const TestLineChart = () => {
  const chartRef = useRef(null);

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
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

    covid19data1().then((d) => {
      console.log(d);
      const data = [d["Aberdeenshire"], d["Angus"], d["Barnet"]];

      const lineChart = new LineChart()
        .data(data)
        .chartProperties({})
        .lineProperties([
          {
            stroke: "#355c7d",
            strokeWidth: 1,
            showPoints: true,
            onRightAxis: false,
          },
          {
            stroke: "#99b898",
            strokeWidth: 2,
            showPoints: false,
            onRightAxis: false,
          },
          {
            stroke: "#E1999C",
            strokeWidth: 3,
            showPoints: false,
            onRightAxis: true,
          },
        ])
        .svg(svg)
        .draw();

      lineChart.animate(2, 20, 400);
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

export default TestLineChart;
