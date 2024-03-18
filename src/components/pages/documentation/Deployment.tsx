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
        Congratulations, you are ready to deploy your Next.js application to
        production. This document will show how to deploy either managed or
        self-hosted using the Next.js Build API.
      </Typography>
    </Box>
  );
}

function Vercel() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Deploy on Vercel
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        The easiest way to deploy your Next.js app is to use the{" "}
        <Link
          href="https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme"
          target="_blank"
        >
          Vercel Platform
        </Link>{" "}
        from the creators of Next.js.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Check out the{" "}
        <Link href="https://nextjs.org/docs/deployment" target="_blank">
          Next.js deployment documentation
        </Link>{" "}
        for more details.
      </Typography>
    </Box>
  );
}

function Netlify() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Deploy on Netlify
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Deploy modern static websites with Netlify. Get CDN, Continuous
        deployment, 1-click HTTPS, and all the services you need.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Check out the{" "}
        <Link
          href="https://docs.netlify.com/configure-builds/common-configurations/next-js/"
          target="_blank"
        >
          official Netlify docs
        </Link>{" "}
        for more details.
      </Typography>
    </Box>
  );
}

function NodeJsServer() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Node.js Server
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Next.js can be deployed to any hosting provider that supports Node.js.
        For example, AWS EC2 or a DigitalOcean Droplet. First, ensure your{" "}
        <code>package.json</code> has the <code>"build"</code> and{" "}
        <code>"start"</code> scripts:
        <Code>{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}`}</Code>
        Check out the{" "}
        <Link
          href="https://nextjs.org/docs/deployment#nodejs-server"
          target="_blank"
        >
          Node.js deployment documentation
        </Link>{" "}
        for more details.
      </Typography>
    </Box>
  );
}

function Deployment() {
  return (
    <React.Fragment>
      <Helmet title="Deployment" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Deployment
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref legacyBehavior>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Deployment</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <Vercel />
          <Netlify />
          <NodeJsServer />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Deployment.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default Deployment;
