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
        Next.js has a file-system based router built on the concept of pages.
        When a file is added to the <code>pages</code> directory, it's
        automatically available as a route. The files inside the{" "}
        <code>pages</code> directory can be used to define most common patterns.
      </Typography>
    </Box>
  );
}

function IndexRoutes() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Index routes
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        The router will automatically route files named index to the root of the
        directory.
        <Code>pages/index.js → /</Code>
        <Code>pages/blog/index.js → /blog</Code>
      </Typography>
    </Box>
  );
}

function NestedRoutes() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Nested routes
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        The router supports nested files. If you create a nested folder
        structure, files will automatically be routed in the same way still.
        <Code>pages/blog/first-post.js → /blog/first-post</Code>
        <Code>
          pages/dashboard/settings/username.js → /dashboard/settings/username
        </Code>
      </Typography>
    </Box>
  );
}

function LinkingBetweenPages() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Linking between pages
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        The Next.js router allows you to do client-side route transitions
        between pages, similar to a single-page application. A React component
        called <code>Link</code> is provided to do this client-side route
        transition.
        <Code>{`import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  )
}

export default Home
`}</Code>
      </Typography>
    </Box>
  );
}

function Routing() {
  return (
    <React.Fragment>
      <Helmet title="Routing" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Routing
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref legacyBehavior>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Routing</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <IndexRoutes />
          <NestedRoutes />
          <LinkingBetweenPages />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Routing.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default Routing;
