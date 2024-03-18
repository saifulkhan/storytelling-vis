import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import {
  Activity,
  Airplay,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Anchor,
  Aperture,
  Archive,
  ArrowDownCircle,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowDown,
  ArrowLeftCircle,
  ArrowLeft,
  ArrowRightCircle,
  ArrowRight,
} from "react-feather";
import { Helmet } from "react-helmet-async";

import {
  Button,
  CardContent,
  Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import DashboardLayout from "../../layouts/Dashboard";

import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

type IconsType = {
  [key: string]: JSX.Element;
};

const icons: IconsType = {
  Activity: <Activity />,
  Airplay: <Airplay />,
  AlertCircle: <AlertCircle />,
  AlertOctagon: <AlertOctagon />,
  AlertTriangle: <AlertTriangle />,
  AlignCenter: <AlignCenter />,
  AlignJustify: <AlignJustify />,
  AlignLeft: <AlignLeft />,
  AlignRight: <AlignRight />,
  Anchor: <Anchor />,
  Aperture: <Aperture />,
  Archive: <Archive />,
  ArrowDownCircle: <ArrowDownCircle />,
  ArrowDownLeft: <ArrowDownLeft />,
  ArrowDownRight: <ArrowDownRight />,
  ArrowDown: <ArrowDown />,
  ArrowLeftCircle: <ArrowLeftCircle />,
  ArrowLeft: <ArrowLeft />,
  ArrowRightCircle: <ArrowRightCircle />,
  ArrowRight: <ArrowRight />,
};

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const IconHolder = styled(Grid)`
  margin: 0.5rem 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;

  p {
    vertical-align: middle;
    display: flex;
  }

  svg {
    margin-right: 0.5rem;
    margin-top: -0.1rem;
  }
`;

const ArrowForward = styled(ArrowForwardIcon)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;

function Icons() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Feather Icons
        </Typography>
        <Typography variant="body2" gutterBottom>
          Simply beautiful open source icons
        </Typography>
        <Paper pt={6}>
          <Grid container spacing={6}>
            {Object.keys(icons).map((key) => {
              return (
                <IconHolder key={key} item md={3}>
                  <Typography variant="body2">
                    {icons[key]} {key}
                  </Typography>
                </IconHolder>
              );
            })}
          </Grid>
        </Paper>
        <Paper pt={3}>
          <Link
            href="https://feathericons.com/"
            target="_blank"
            rel="nofollow noreferrer"
          >
            <Button
              component="a"
              variant="contained"
              color="secondary"
              target="_blank"
            >
              Browse all available icons
              <ArrowForward />
            </Button>
          </Link>
        </Paper>
      </CardContent>
    </Card>
  );
}

function FeatherIcons() {
  return (
    <React.Fragment>
      <Helmet title="Feather Icons" />
      <Typography variant="h3" gutterBottom display="inline">
        Feather Icons
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref legacyBehavior>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref legacyBehavior>
          <Link>Icons</Link>
        </NextLink>
        <Typography>Feather Icons</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Icons />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

FeatherIcons.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FeatherIcons;
