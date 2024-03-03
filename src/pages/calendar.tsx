import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import { darken, lighten } from "polished";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import DashboardLayout from "../layouts/Dashboard";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import demoEvents from "../mocks/demo-events.json";

const calendarStyle = (props: any) => css`
  .fc-button,
  .fc-button-primary {
    box-shadow: ${props.theme.shadows[1]};
    color: ${props.theme.palette.primary.contrastText};
    background: ${props.theme.palette.primary.main};
    font-weight: ${props.theme.typography.fontWeightMedium};
    font-family: ${props.theme.typography.fontFamily};
    border: 0;
    outline: 0;
    box-shadow: none;

    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    &:hover,
    &:active,
    &:focus,
    &:not(:disabled):active,
    &:not(:disabled):active:focus {
      box-shadow: none;
      background-color: ${darken(0.1, props.theme.palette.primary.main)};
    }

    &:not(:disabled):active,
    &:not(:disabled).fc-button-active {
      background-color: ${darken(0.1, props.theme.palette.primary.main)};

      &:focus {
        box-shadow: none;
      }
    }

    &-primary:disabled {
      background: rgba(0, 0, 0, 0.12);
      color: rgba(0, 0, 0, 0.26);
    }
  }

  .fc-event {
    padding: ${props.theme.spacing(1)};
    margin: ${props.theme.spacing(0.5)};
  }

  .fc-h-event {
    border: 1px solid ${darken(0.05, props.theme.palette.secondary.main)};
    background: ${props.theme.palette.secondary.main};
  }

  .fc-unthemed td.fc-today {
    background: ${lighten(0.5, props.theme.palette.primary.main)};
  }

  .fc-dayGrid-view .fc-week-number,
  .fc-dayGrid-view .fc-day-number {
    padding: ${props.theme.spacing(1)};
  }

  .fc th {
    padding: ${props.theme.spacing(1)};
  }
`;

const FullCalendarWrapper = styled.div`
  ${calendarStyle}
`;

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function EmptyCard() {
  return (
    <Card mb={6}>
      <CardContent p={6}>
        <FullCalendarWrapper>
          <FullCalendar
            initialView="dayGridMonth"
            initialDate="2021-02-14"
            plugins={[dayGridPlugin, interactionPlugin]}
            events={demoEvents}
            editable={true}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridDay,dayGridWeek,dayGridMonth",
            }}
          />
        </FullCalendarWrapper>
      </CardContent>
    </Card>
  );
}

function Calendar() {
  return (
    <React.Fragment>
      <Helmet title="Calendar" />
      <Typography variant="h3" gutterBottom display="inline">
        Calendar
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Pages</Link>
        </NextLink>
        <Typography>Calendar</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EmptyCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Calendar.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Calendar;
