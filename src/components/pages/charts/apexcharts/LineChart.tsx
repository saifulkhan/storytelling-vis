import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import dynamic from "next/dynamic";

import { CardContent, Card as MuiCard, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import { ThemeProps } from "../../../../types/theme";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  height: 350px;
  width: 100%;
`;

const LineChart = ({ theme }: ThemeProps) => {
  const data = [
    {
      name: "Session Duration",
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: "Page Views",
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
    {
      name: "Total Visits",
      data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
    },
  ];

  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [5, 7, 5],
      curve: "straight",
      dashArray: [0, 8, 5],
    },
    markers: {
      size: 0,
      style: "hollow", // full, hollow, inverted
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
        "07 Jan",
        "08 Jan",
        "09 Jan",
        "10 Jan",
        "11 Jan",
        "12 Jan",
      ],
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val: any) {
              return val + " (mins)";
            },
          },
        },
        {
          title: {
            formatter: function (val: any) {
              return val + " per session";
            },
          },
        },
        {
          title: {
            formatter: function (val: any) {
              return val;
            },
          },
        },
      ],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    colors: [
      theme.palette.primary.light,
      theme.palette.success.light,
      theme.palette.warning.light,
      theme.palette.error.light,
      theme.palette.info.light,
    ],
  };

  return (
    <Card mb={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Line Chart
        </Typography>
        <Typography variant="body2" gutterBottom>
          Line charts are a typical pictorial representation that depicts trends
          and behaviors over time.
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Chart options={options} series={data} type="line" height="350" />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(LineChart);
