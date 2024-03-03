import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import {
  CardContent,
  Fade,
  Grid,
  IconButton,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Slide,
  Snackbar,
  SnackbarOrigin,
  Typography,
  ListProps,
  SlideProps,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { spacing } from "@mui/system";

import DashboardLayout from "../../layouts/Dashboard";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Button = styled(MuiButton)(spacing);

function SimpleSnackbar() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Simple Snackbar
        </Typography>
        <Typography variant="body2" gutterBottom>
          A basic snackbar that aims to reproduce Google Keep's snackbar
          behavior.
        </Typography>
        <Paper mt={3}>
          <Button onClick={handleClick} variant="contained" color="secondary">
            Open simple snackbar
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Note archived"
            action={
              <React.Fragment>
                <Button color="secondary" size="small" onClick={handleClose}>
                  UNDO
                </Button>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

interface PositionedSnackbarState extends SnackbarOrigin {
  open: boolean;
}

function PositionedSnackbar() {
  const [state, setState] = React.useState<PositionedSnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const buttons = (
    <React.Fragment>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        mr={2}
        onClick={handleClick({ vertical: "top", horizontal: "center" })}
      >
        Top-Center
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        mr={2}
        onClick={handleClick({ vertical: "top", horizontal: "right" })}
      >
        Top-Right
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        mr={2}
        onClick={handleClick({ vertical: "bottom", horizontal: "right" })}
      >
        Bottom-Right
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        mr={2}
        onClick={handleClick({ vertical: "bottom", horizontal: "center" })}
      >
        Bottom-Center
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        mr={2}
        onClick={handleClick({ vertical: "bottom", horizontal: "left" })}
      >
        Bottom-Left
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        mr={2}
        onClick={handleClick({ vertical: "top", horizontal: "left" })}
      >
        Top-Left
      </Button>
    </React.Fragment>
  );

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Positioned Snackbar
        </Typography>
        <Typography variant="body2" gutterBottom>
          There may be circumstances when the placement of the snackbar needs to
          be more flexible.
        </Typography>
        <Paper mt={3}>
          {buttons}
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message="I love snacks"
            key={vertical + horizontal}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

interface ConsecutiveSnackbarMessage {
  message: string;
  key: number;
}

function ConsecutiveSnackbars() {
  const [snackPack, setSnackPack] = React.useState<
    ConsecutiveSnackbarMessage[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    ConsecutiveSnackbarMessage | undefined
  >(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClick = (message: string) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Consecutive Snackbar
        </Typography>
        <Typography variant="body2" gutterBottom>
          Per Google's guidelines, when multiple snackbar updates are necessary,
          they should appear one at a time.
        </Typography>
        <Paper mt={3}>
          <Button
            variant="contained"
            color="secondary"
            mr={2}
            onClick={handleClick("Message A")}
          >
            Show message A
          </Button>
          <Button
            variant="contained"
            color="secondary"
            mr={2}
            onClick={handleClick("Message B")}
          >
            Show message B
          </Button>
          <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={messageInfo ? messageInfo.message : undefined}
            action={
              <React.Fragment>
                <Button color="secondary" size="small" onClick={handleClose}>
                  UNDO
                </Button>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                  size="large"
                >
                  <CloseIcon />
                </IconButton>
              </React.Fragment>
            }
            TransitionProps={{
              onExited: handleExited,
            }}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

function DirectionSnackbar() {
  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  const handleClick =
    (Transition: React.ComponentType<TransitionProps>) => () => {
      setTransition(() => Transition);
      setOpen(true);
    };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Control Direction
        </Typography>
        <Typography variant="body2" gutterBottom>
          Change the direction of the transition. Slide is the default
          transition.
        </Typography>
        <Paper mt={3}>
          <Button
            onClick={handleClick(TransitionLeft)}
            variant="contained"
            color="secondary"
            mr={2}
          >
            Right
          </Button>
          <Button
            onClick={handleClick(TransitionUp)}
            variant="contained"
            color="secondary"
            mr={2}
          >
            Up
          </Button>
          <Button
            onClick={handleClick(TransitionRight)}
            variant="contained"
            color="secondary"
            mr={2}
          >
            Left
          </Button>
          <Button
            onClick={handleClick(TransitionDown)}
            variant="contained"
            color="secondary"
            mr={2}
          >
            Down
          </Button>
          <Snackbar
            open={open}
            onClose={handleClose}
            TransitionComponent={transition}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
            message={<span id="message-id">I love snacks</span>}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

function TransitionSnackbar() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Snackbar Transition
        </Typography>
        <Typography variant="body2" gutterBottom>
          Use a different transition (fade).
        </Typography>
        <Paper mt={3}>
          <Button onClick={handleClick} variant="contained" color="secondary">
            Open with Fade Transition
          </Button>
          <Snackbar
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
            message={<span id="message-id">I love snacks</span>}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

function Snackbars() {
  return (
    <React.Fragment>
      <Helmet title="Snackbars" />
      <Typography variant="h3" gutterBottom display="inline">
        Snackbars
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Components</Link>
        </NextLink>
        <Typography>Snackbars</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <SimpleSnackbar />
          <ConsecutiveSnackbars />
          <TransitionSnackbar />
        </Grid>
        <Grid item xs={12} md={6}>
          <PositionedSnackbar />
          <DirectionSnackbar />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Snackbars.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Snackbars;
