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
        react-i18next is a powerful internationalization framework for React
        which is based on i18next. The module provides multiple components eg.
        to assert that needed translations get loaded or that your content gets
        rendered when the language changes.
        <br />
        <br />
        Translations can be configured in the <code>/src/i18n.js</code> file.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <Code>{`const resources = {
  en: {
    translation: {
      "Welcome back": "Welcome back",
    },
  },
  fr: {
    translation: {
      "Welcome back": "Bon retour",
    },
  },
  de: {
    translation: {
      "Welcome back": "Willkommen zurück",
    },
  },
};`}</Code>
      </Typography>
    </Box>
  );
}

function UsageWithHooks() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Usage with hooks
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Using the hook in functional components is one of the options you got.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <Code>{`import React from 'react';

import { useTranslation } from 'react-i18next';

function MyComponent () {
  const { t, i18n } = useTranslation();
  return <h1>{t('Welcome to React')}</h1>
}`}</Code>
      </Typography>
    </Box>
  );
}

function UsageWithHOC() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Usage with HOC
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Using higher order components is one of the most used method to extend
        existing components by passing additional props to them.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <Code>{`import React from 'react';

import { withTranslation } from 'react-i18next';

function MyComponent ({ t }) {
  return <h1>{t('Welcome to React')}</h1>
}

export default withTranslation()(MyComponent);`}</Code>
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
        To learn more about react-i18next,{" "}
        <Link
          href="https://react.i18next.com/"
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

function Internationalization() {
  return (
    <React.Fragment>
      <Helmet title="Internationalization" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Internationalization
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Internationalization</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <UsageWithHooks />
          <UsageWithHOC />
          <LearnMore />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Internationalization.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default Internationalization;
