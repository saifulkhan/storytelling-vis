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

const PieChart = ({ theme }: ThemeProps) => {
  const data = [44, 55, 13, 33];

  const options = {
    dataLabels: {
      enabled: false,
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
          Pie Chart
        </Typography>
        <Typography variant="body2" gutterBottom>
          Pie charts are an instrumental visualization tool useful in expressing
          data and information in terms of percentages, ratio.
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Chart options={options} series={data} type="donut" height="350" />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(PieChart);
