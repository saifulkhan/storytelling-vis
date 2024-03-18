import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Doughnut } from "react-chartjs-2";

import { CardContent, Card as MuiCard, Typography } from "@mui/material";
import { orange, red } from "@mui/material/colors";
import { spacing } from "@mui/system";

import { ThemeProps } from "../../../../types/theme";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  height: 300px;
`;

function DoughnutChart({ theme }: ThemeProps) {
  const data = {
    labels: ["Social", "Search Engines", "Direct", "Other"],
    datasets: [
      {
        data: [260, 125, 54, 146],
        backgroundColor: [
          theme.palette.secondary.main,
          orange[500],
          red[500],
          theme.palette.grey[300],
        ],
        borderColor: "transparent",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Card mb={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Doughnut Chart
        </Typography>
        <Typography variant="body2" gutterBottom>
          Doughnut charts are excellent at showing the relational proportions
          between data.
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Doughnut data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export default withTheme(DoughnutChart);
