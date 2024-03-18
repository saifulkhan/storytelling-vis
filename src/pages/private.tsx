import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";

import { Alert as MuiAlert } from "@mui/material";
import { spacing } from "@mui/system";

import AuthGuard from "../components/guards/AuthGuard";
import DashboardLayout from "../layouts/Dashboard";
import DefaultDashboard from "./dashboard/default";

const Alert = styled(MuiAlert)(spacing);

function Private() {
  return (
    <AuthGuard>
      <Alert mb={4} severity="info">
        This page is only visible by authenticated users.
      </Alert>
      <DefaultDashboard />
    </AuthGuard>
  );
}

Private.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Private;
