import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import DocLayout from "../../../layouts/Doc";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

import Code from "../../Code";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Introduction() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Introduction
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        This theme uses MUI in combination with Emotion. On this page we try to
        cover the basics on how to adjust the color palette and other styles.
      </Typography>
    </Box>
  );
}

function HowItWorks() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        How it works
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        MUI's{" "}
        <Link
          href="https://mui.com/customization/theming/#createtheme-options-args-theme"
          target="_blank"
          rel="noreferrer noopener"
        >
          createTheme
        </Link>{" "}
        is used to extend MUI's default styling. Mira is using both the MUI
        ThemeProvider as Emotion ThemeProvider. This way, global theme variables
        will be applied to both MUI's components as custom Emotion components.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        How to access theme variables from a component:
        <Code>{`const CustomComponent = styled.div\`
  background: \${props => props.theme.palette.primary.main};
  color: \${props => props.theme.palette.common.white};
  padding: \${props => props.theme.spacing(2)};
\`;

const Custom = ({children}) => (
  <CustomComponent>
    {children}
  </CustomComponent>
);`}</Code>
      </Typography>
    </Box>
  );
}

function AdjustingTheme() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Adjusting theme variables
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        In the <code>/theme</code> folder you can find all the theme variables.
        They are categorized by palettes, shadows, typography, overrides and
        theme variants. You are able to control each on them inndividually.
        Typography example:
        <Code>{`const typography = {
  h1: {
    fontSize: "2rem",
    fontWeight: 600,
    lineHeight: 1.2
  },
  h2: {
    fontSize: "1.75rem",
    fontWeight: 600,
    lineHeight: 1.2
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.2
  },
  //etc
};`}</Code>
      </Typography>
    </Box>
  );
}

function Theming() {
  return (
    <React.Fragment>
      <Helmet title="Theming" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Theming
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref legacyBehavior>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Theming</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <HowItWorks />
          <AdjustingTheme />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Theming.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default Theming;
