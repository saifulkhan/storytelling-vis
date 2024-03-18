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

const CandlestickChart = ({ theme }: ThemeProps) => {
  const data = [
    {
      data: [
        {
          x: new Date(2016, 1, 1),
          y: [51.98, 56.29, 51.59, 53.85],
        },
        {
          x: new Date(2016, 2, 1),
          y: [53.66, 54.99, 51.35, 52.95],
        },
        {
          x: new Date(2016, 3, 1),
          y: [52.96, 53.78, 51.54, 52.48],
        },
        {
          x: new Date(2016, 4, 1),
          y: [52.54, 52.79, 47.88, 49.24],
        },
        {
          x: new Date(2016, 5, 1),
          y: [49.1, 52.86, 47.7, 52.78],
        },
        {
          x: new Date(2016, 6, 1),
          y: [52.83, 53.48, 50.32, 52.29],
        },
        {
          x: new Date(2016, 7, 1),
          y: [52.2, 54.48, 51.64, 52.58],
        },
        {
          x: new Date(2016, 8, 1),
          y: [52.76, 57.35, 52.15, 57.03],
        },
        {
          x: new Date(2016, 9, 1),
          y: [57.04, 58.15, 48.88, 56.19],
        },
        {
          x: new Date(2016, 10, 1),
          y: [56.09, 58.85, 55.48, 58.79],
        },
        {
          x: new Date(2016, 11, 1),
          y: [58.78, 59.65, 58.23, 59.05],
        },
        {
          x: new Date(2017, 0, 1),
          y: [59.37, 61.11, 59.35, 60.34],
        },
        {
          x: new Date(2017, 1, 1),
          y: [60.4, 60.52, 56.71, 56.93],
        },
        {
          x: new Date(2017, 2, 1),
          y: [57.02, 59.71, 56.04, 56.82],
        },
        {
          x: new Date(2017, 3, 1),
          y: [56.97, 59.62, 54.77, 59.3],
        },
        {
          x: new Date(2017, 4, 1),
          y: [59.11, 62.29, 59.1, 59.85],
        },
        {
          x: new Date(2017, 5, 1),
          y: [59.97, 60.11, 55.66, 58.42],
        },
        {
          x: new Date(2017, 6, 1),
          y: [58.34, 60.93, 56.75, 57.42],
        },
        {
          x: new Date(2017, 7, 1),
          y: [57.76, 58.08, 51.18, 54.71],
        },
        {
          x: new Date(2017, 8, 1),
          y: [54.8, 61.42, 53.18, 57.35],
        },
        {
          x: new Date(2017, 9, 1),
          y: [57.56, 63.09, 57.0, 62.99],
        },
        {
          x: new Date(2017, 10, 1),
          y: [62.89, 63.42, 59.72, 61.76],
        },
        {
          x: new Date(2017, 11, 1),
          y: [61.71, 64.15, 61.29, 63.04],
        },
      ],
    },
  ];

  const options = {
    stroke: {
      width: 1,
    },
    xaxis: {
      type: "datetime",
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
          Candlestick Chart
        </Typography>
        <Typography variant="body2" gutterBottom>
          A candlestick chart is a style of financial chart used to describe
          price movements.
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Chart
            options={options}
            series={data}
            type="candlestick"
            height="350"
          />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(CandlestickChart);
