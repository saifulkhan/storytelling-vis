import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { Helmet } from "react-helmet-async";

import { Button as MuiButton, Typography } from "@mui/material";

const Button = styled(MuiButton)`
  margin-top: 16px;
`;

const Wrapper = styled.div`
  padding: 48px;
  text-align: center;
  background: transparent;

  @media (min-width: 960px) {
    padding: 80px;
  }
`;

function Page404() {
  return (
    <Wrapper>
      <Helmet title="404 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Page not found.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        The page you are looking for might have been removed.
      </Typography>

      <Link href="/" passHref legacyBehavior>
        <Button variant="contained" color="secondary">
          Return to website
        </Button>
      </Link>
    </Wrapper>
  );
}

export default Page404;
