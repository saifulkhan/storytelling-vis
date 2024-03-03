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
        Hello, I hope you find this theme useful. Mira has been crafted on top
        of Material UI. The included demo pages don't replace the official ones,
        but provide a clear view of all new components and extended styles that
        this theme provides on top of Material UI.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        The docs includes information to understand how the theme is organized,
        how to compile and extend it to fit your needs, and how to make changes
        to the source code.
      </Typography>
    </Box>
  );
}

function TableOfContents() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Table of Contents
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <ul>
          <li>
            <NextLink href="/documentation/getting-started" passHref>
              <Link>Getting Started</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/routing" passHref>
              <Link>Routing</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/auth/auth0" passHref>
              <Link>Auth0 Authentication</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/auth/cognito" passHref>
              <Link>Cognito Authentication</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/auth/firebase" passHref>
              <Link>Firebase Authentication</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/auth/jwt" passHref>
              <Link>JWT Authentication</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/guards" passHref>
              <Link>Guards</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/theming" passHref>
              <Link>Theming</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/api-calls" passHref>
              <Link>API Calls</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/redux" passHref>
              <Link>Redux</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/internationalization" passHref>
              <Link>Internationalization</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/environment-variables" passHref>
              <Link>Environment Variables</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/eslint-and-prettier" passHref>
              <Link>ESLint & Prettier</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/deployment" passHref>
              <Link>Deployment</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/documentation/support" passHref>
              <Link>Support</Link>
            </NextLink>
          </li>
          <li>
            <NextLink href="/changelog" passHref>
              <Link>Changelog</Link>
            </NextLink>
          </li>
        </ul>
      </Typography>
    </Box>
  );
}

function SomethingMissing() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Something missing?
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        If something is missing in the documentation or if you found some part
        confusing, please send us an email (
        <Link href="mailto:support@bootlab.io">support@bootlab.io</Link>) with
        your suggestions for improvement. We love hearing from you!
      </Typography>
    </Box>
  );
}

function Welcome() {
  return (
    <React.Fragment>
      <Helmet title="Getting Started" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Documentation
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref>
              <Link>Dashboard</Link>
            </NextLink>
            <Typography>Documentation</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <TableOfContents />
          <SomethingMissing />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Welcome.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default Welcome;
