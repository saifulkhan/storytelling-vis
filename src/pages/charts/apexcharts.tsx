import React, { useEffect } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import {
  Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import DashboardLayout from "../../layouts/Dashboard";

import AreaChart from "../../components/pages/charts/apexcharts/AreaChart";
import BarChart from "../../components/pages/charts/apexcharts/BarChart";
import CandlestickChart from "../../components/pages/charts/apexcharts/CandlestickChart";
import ColumnChart from "../../components/pages/charts/apexcharts/ColumnChart";
import HeatmapChart from "../../components/pages/charts/apexcharts/HeatmapChart";
import LineChart from "../../components/pages/charts/apexcharts/LineChart";
import MixedChart from "../../components/pages/charts/apexcharts/MixedChart";
import PieChart from "../../components/pages/charts/apexcharts/PieChart";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function ApexCharts() {
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }, []);

  return (
    <React.Fragment>
      <Helmet title="ApexCharts" />
      <Typography variant="h3" gutterBottom display="inline">
        ApexCharts
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Charts</Link>
        </NextLink>
        <Typography>ApexCharts</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <LineChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <AreaChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ColumnChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <HeatmapChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <MixedChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <CandlestickChart />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

ApexCharts.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ApexCharts;
