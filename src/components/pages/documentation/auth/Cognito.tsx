import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import DocLayout from "../../../../layouts/Doc";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

import Code from "../../../Code";

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
        Amazon Cognito lets you add user sign-up, sign-in, and access control to
        your web and mobile apps quickly and easily. Amazon Cognito scales to
        millions of users and supports sign-in with social identity providers,
        such as Apple, Facebook, Google, and Amazon, and enterprise identity
        providers via SAML 2.0 and OpenID Connect.
      </Typography>
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
        Follow these steps if you want to enable Amazon Cognito authentication
        in your application.
      </Typography>
      <Typography variant="h4" gutterBottom>
        1. Enable AuthProvider
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Enable Cognito's <code>AuthProvider</code> in{" "}
        <code>/src/pages/_app.tsx</code>.
        <Code>{`import { AuthProvider } from "./contexts/CognitoContext";
        
function App() {
  return (
    <AuthProvider>
      {content}
    </AuthProvider>;
  )
}`}</Code>
      </Typography>
      <Typography variant="h4" gutterBottom>
        2. Enable useAuth hook
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Enable Amazon Cognito's <code>useAuth</code> hook in{" "}
        <code>/src/hooks/useAuth.ts</code>.
        <Code>{`import { AuthContext } from "../contexts/CognitoContext";
        
const useAuth = () => {
  return useContext(AuthContext);
};`}</Code>
      </Typography>
    </Box>
  );
}

function HowTo() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        How to use
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Learn how to use Cognito authentication. There are multiple examples
        included, including sign in, sign up and sign out.
      </Typography>
      <Typography variant="h4" gutterBottom>
        Retrieve user info
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <Code>{`import useAuth from '../hooks/useAuth';

const App = () => {
  const { displayName } = useAuth();

  return (
    <span>
      {user.displayName}
    </span>
  );
};`}</Code>
      </Typography>
      <Typography variant="h4" gutterBottom>
        Execute actions
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <Code>{`import useAuth from '../hooks/useAuth';

const App = () => {
  const { signIn } = useAuth();

  return (
    <button onClick={() => signIn()}>
      Sign in
    </button>
  );
};`}</Code>
      </Typography>
    </Box>
  );
}

function Cognito() {
  return (
    <React.Fragment>
      <Helmet title="Amazon Cognito" />

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            Amazon Cognito
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <NextLink href="/" passHref legacyBehavior>
              <Link>Dashboard</Link>
            </NextLink>
            <NextLink href="/documentation/welcome" passHref legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
            <Typography>Amazon Cognito</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          <Introduction />
          <QuickStart />
          <HowTo />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Cognito.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>;
};

export default Cognito;
