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
        Your project can consume variables declared in your environment as if
        they were declared locally in your JS files. By default you will have{" "}
        <code>NODE_ENV</code> defined for you, and any other environment
        variables starting with <code>NEXT_PUBLIC_</code>.
      </Typography>
    </Box>
  );
}

function AddingEnvironmentVariables() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Adding environment variables
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        To define permanent environment variables, create a file called{" "}
        <code>.env</code> in the root of your project:
        <Code>NEXT_PUBLIC_NOT_SECRET_CODE=abcdef</Code>
        Note: You need to restart the development server after changing{" "}
        <code>.env</code> files.
      </Typography>
    </Box>
  );
}

function AccessingEnvironmentVariables() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Accessing environment variables
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Environment variables will be defined for you on{" "}
        <code>process.env</code>. For example, having an environment variable
        named <code>NEXT_PUBLIC_NOT_SECRET_CODE</code> will be exposed in your
        JS as <code>process.env.NEXT_PUBLIC_NOT_SECRET_CODE</code>.
        <Code>{`if (process.env.NODE_ENV !== 'production') {
  // do something
}`}</Code>
        <Code>{`<title>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</title>`}</Code>
      </Typography>
    </Box>
  );
}

function LearnMore() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Learn more
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        To learn more about environment variables,{" "}
        <Link
          href="https://nextjs.org/docs/basic-features/environment-variables"
          target="_blank"
          rel="noreferrer noopener"
        >
          click here
        </Link>
        .
      </Typography>
    </Box>
  );
}

function EnvironmentVariables() {
  return (
    <React.Fragment>
      <Helmet title="Environment Variables" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Environment Variables
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref legacyBehavior>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Environment Variables</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <AddingEnvironmentVariables />
          <AccessingEnvironmentVariables />
          <LearnMore />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

EnvironmentVariables.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default EnvironmentVariables;
