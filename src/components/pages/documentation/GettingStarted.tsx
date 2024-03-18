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

function Contents() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Contents
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Inside the zip-file you'll find the following directories and files.
        Both compiled and minified distrubution files, as well as the source
        files are included in the package.
      </Typography>

      <Code>{`theme/
  ├── .gitignore
  ├── package.json
  ├── package-lock.json
  ├── README.md
  ├── build/
  ├── public/
  │   ├── index.html
  │   └── manifest.json
  └── src/
      ├── components/
      ├── layouts/
      ├── pages/
      ├── redux/
      ├── routes/
      ├── vendor/
      ├── App.js
      ├── index.js
      └── theme.js`}</Code>
    </Box>
  );
}

function QuickStart() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Quick start
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        This is a{" "}
        <Link
          href="https://nextjs.org/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Next.js
        </Link>{" "}
        project bootstrapped with{" "}
        <Link
          href="https://github.com/vercel/next.js/tree/canary/packages/create-next-app"
          target="_blank"
          rel="noreferrer noopener"
        >
          create-next-app
        </Link>
        . You'll need to install Node.js (v16 or up) before using Mira.
      </Typography>

      <Typography variant="subtitle1" gutterBottom my={4}>
        Once{" "}
        <Link
          href="https://nodejs.org/en/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Node.js
        </Link>{" "}
        is installed, run <code>npm install</code> to install the rest of Mira's
        dependencies. All dependencies will be downloaded to the{" "}
        <code>node_modules</code> directory.
        <br />
        <Code>npm install</Code>
      </Typography>

      <Typography variant="subtitle1" gutterBottom my={4}>
        Now you're ready to modify the source files and generate new files. To
        automatically detect file changes and start a local webserver at{" "}
        <code>http://localhost:3000</code>, run the following command.
        <br />
        <Code>npm run dev</Code>
      </Typography>
    </Box>
  );
}

function BuildTools() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Build tools
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Start a local webserver at <code>http://localhost:3000</code> and detect
        file changes:
        <br />
        <Code>npm run dev</Code>
      </Typography>

      <Typography variant="subtitle1" gutterBottom my={4}>
        Compile, optimize, minify and uglify all source files to build/:
        <br />
        <Code>npm run build</Code>
      </Typography>
    </Box>
  );
}

function GettingStarted() {
  return (
    <React.Fragment>
      <Helmet title="Getting Started" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Getting Started
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref legacyBehavior>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Getting Started</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <QuickStart />
          <BuildTools />
          <Contents />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

GettingStarted.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default GettingStarted;
