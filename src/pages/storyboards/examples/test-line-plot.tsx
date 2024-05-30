import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Head from "next/head";
import { Box } from "@mui/material";

import { LinePlot } from "../../../components/storyboards/plots/LinePlot";
import { getCovid19Data } from "../../../services/DataService";

const TestLinePlotPage = () => {
  const chartRef = useRef(null);

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const height = 550;
  const width = 1500;

  useEffect(() => {
    if (!chartRef.current) return;
    console.log("useEffect triggered");

    d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .node();

    getCovid19Data().then((d) => {
      console.log(d);
      const data = [d["Aberdeenshire"], d["Angus"], d["Barnet"]];

      const lineChart = new LinePlot()
        .setData(data)
        .setName("Regions")
        .setPlotProps({
          title: "Example line plot",
          margin: { top: 50, right: 60, bottom: 50, left: 60 },
        })
        .setLineProps([
          {
            stroke: "#355c7d",
            strokeWidth: 1,
            showPoints: false,
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
            strokeWidth: 1,
            showPoints: true,
            onRightAxis: true,
          },
        ])
        .setCanvas(chartRef.current)
        .plot();

      // lineChart.animate(2, 20, 400);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Test Line Plot</title>
      </Head>

      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <svg
          ref={chartRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: "1px solid",
          }}
        ></svg>
      </Box>
    </>
  );
};

export default TestLinePlotPage;
