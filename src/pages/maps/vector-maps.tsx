import React from "react";
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

import Africa from "../../components/pages/maps/vector-maps/Africa";
import Asia from "../../components/pages/maps/vector-maps/Asia";
import China from "../../components/pages/maps/vector-maps/China";
import Europe from "../../components/pages/maps/vector-maps/Europe";
import NorthAmerica from "../../components/pages/maps/vector-maps/NorthAmerica";
import Oceania from "../../components/pages/maps/vector-maps/Oceania";
import SouthAmerica from "../../components/pages/maps/vector-maps/SouthAmerica";
import USA from "../../components/pages/maps/vector-maps/USA";
import World from "../../components/pages/maps/vector-maps/World";

import DashboardLayout from "../../layouts/Dashboard";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function VectorMaps() {
  return (
    <React.Fragment>
      <Helmet title="Vector Maps" />
      <Typography variant="h3" gutterBottom display="inline">
        Vector Maps
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Maps</Link>
        </NextLink>
        <Typography>Vector Maps</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <World />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Africa />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Asia />
        </Grid>
        <Grid item xs={12} lg={6}>
          <China />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Europe />
        </Grid>
        <Grid item xs={12} lg={6}>
          <NorthAmerica />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Oceania />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SouthAmerica />
        </Grid>
        <Grid item xs={12} lg={6}>
          <USA />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

VectorMaps.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VectorMaps;
