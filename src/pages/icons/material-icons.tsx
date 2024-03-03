import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
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
import {
  AccessAlarm,
  AccessAlarms,
  Accessibility,
  AccessibilityNew,
  Accessible,
  AccessibleForward,
  AccessTime,
  AccountBalance,
  AccountBalanceWallet,
  AccountBox,
  AccountCircle,
  AcUnit,
  Adb,
  Add,
  AddAlarm,
  AddAlert,
  AddAPhoto,
  AddBox,
  AddCircle,
  AddCircleOutline,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/Dashboard";

type IconsType = {
  [key: string]: JSX.Element;
};

const icons: IconsType = {
  AccessAlarm: <AccessAlarm />,
  AccessAlarms: <AccessAlarms />,
  Accessibility: <Accessibility />,
  AccessibilityNew: <AccessibilityNew />,
  Accessible: <Accessible />,
  AccessibleForward: <AccessibleForward />,
  AccessTime: <AccessTime />,
  AccountBalance: <AccountBalance />,
  AccountBalanceWallet: <AccountBalanceWallet />,
  AccountBox: <AccountBox />,
  AccountCircle: <AccountCircle />,
  AcUnit: <AcUnit />,
  Adb: <Adb />,
  Add: <Add />,
  AddAlarm: <AddAlarm />,
  AddAlert: <AddAlert />,
  AddAPhoto: <AddAPhoto />,
  AddBox: <AddBox />,
  AddCircle: <AddCircle />,
  AddCircleOutline: <AddCircleOutline />,
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
          Material Icons
        </Typography>
        <Typography variant="body2" gutterBottom>
          Material Icons by @mui/icons-material
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
            href="https://mui.com/material-ui/material-icons/"
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

function MaterialIcons() {
  return (
    <React.Fragment>
      <Helmet title="Material Icons" />
      <Typography variant="h3" gutterBottom display="inline">
        Material Icons
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Icons</Link>
        </NextLink>
        <Typography>Material Icons</Typography>
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

MaterialIcons.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MaterialIcons;
