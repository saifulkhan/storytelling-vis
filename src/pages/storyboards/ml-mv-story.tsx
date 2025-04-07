/**
 ** Implements machine learning multivariate (MLMV) story
 **/

import { useEffect, useState, useRef } from "react";
import type { ReactElement } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Fade,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PauseIcon from "@mui/icons-material/Pause";
import { blue } from "@mui/material/colors";

import DashboardLayout from "../../layouts/Dashboard";
import { getMLData } from "../../services/DataService";
import { getTableData } from "../../services/TableService";
import { ParallelCoordinatePlot } from "../../components/storyboards/plots/ParallelCoordinatePlot";
import usePlayPauseLoop from "../../hooks/usePlayPauseLoop";
import {
  sortTimeseriesData,
} from "../../utils/storyboards/common";
import { MSBFeatureActionFactory } from "../../utils/storyboards/feature-action/MSBFeatureActionFactory";
import { DateActionArray } from "../../utils/storyboards/feature-action/FeatureActionTypes";
import { TimeSeriesPoint } from "../../utils/storyboards/data-processing/TimeseriesPoint";

const MLMVStoryPage = () => {
  const WIDTH = 1200,
    HEIGHT = 800;
  const HYPERPARAMS = [
    "channels",
    "kernel_size",
    "layers",
    "samples_per_class",
  ];

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(null);
  const [hyperparam, setHyperparam] = useState<string>(null);
  const [data, setData] = useState<TimeSeriesPoint[]>(null);
  const [table, setTable] = useState<any>(null);

  const plot = useRef(new ParallelCoordinatePlot()).current;
  const { isPlaying, togglePlayPause, pause } = usePlayPauseLoop(plot);

  // Load ML data and feature action table data
  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const _data = await getMLData();
        setData(_data);
        const _table = await getTableData("ML: Multivariate");
        setTable(_table);

        console.log("MLMVStoryPage: useEffect 1: data: ", data);
        console.log("MLMVStoryPage: useEffect 1: table: ", table);
      } catch (error) {
        console.error("MLMVStoryPage: Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, []);

  // Once a hyperparameter/key is selected create feature-actions and plot
  useEffect(() => {
    if (!hyperparam || !data || !chartRef.current) return;

    console.log("MLMVStoryPage: useEffect 2: key: ", hyperparam);
    console.log("MLMVStoryPage: useEffect 2: data: ", data[hyperparam]);

    // FeatureActionBuilder takes TimeseriesData, so we need to transform it
    const _data = sortTimeseriesData(data, hyperparam);

    const actions: DateActionArray = new MSBFeatureActionFactory()
      .setProps({ metric: "accuracy", window: 0 })
      .setData(_data)
      .setTable(table)
      .create();

    plot
      .setPlotProps({ margin: { top: 150, right: 50, bottom: 60, left: 60 } })
      .setName(hyperparam)
      .setData(_data)
      .setCanvas(chartRef.current)
      .setActions(actions);

    pause();

    return () => {};
  }, [hyperparam]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setHyperparam(newKey);
    }
  };

  const handleBeginningButton = () => {};

  const handleBackButton = () => {};

  const handlePlayButton = () => {};

  return (
    <>
      <Head>
        <title>ML: Multivariate Story</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        {/* <Container> */}
        <Card sx={{}}>
          <CardHeader
            avatar={
              <Avatar style={{ backgroundColor: blue[500] }}>
                <AutoStoriesIcon />
              </Avatar>
            }
            title="ML: Multivariate Story"
            subheader="Choose a hyperparameter, and click play to animate the story"
          />
          <CardContent sx={{ pt: "8px" }}>
            {loading ? (
              <Box sx={{ height: 40 }}>
                <Fade
                  in={loading}
                  style={{
                    transitionDelay: loading ? "800ms" : "0ms",
                  }}
                  unmountOnExit
                >
                  <LinearProgress />
                </Fade>
              </Box>
            ) : (
              <>
                <FormGroup
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                      alignItems: "center",
                    },
                  }}
                >
                  <FormControl sx={{ m: 1, width: 300, mt: 0 }} size="small">
                    <InputLabel id="select-region-label">
                      Select hyperparameter
                    </InputLabel>
                    <Select
                      labelId="select-region-label"
                      id="select-region-label"
                      displayEmpty
                      onChange={handleSelection}
                      value={hyperparam}
                      input={<OutlinedInput label="Select hyperparameter" />}
                    >
                      {HYPERPARAMS.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                    <Button
                      variant="contained"
                      // disabled={!key}
                      disabled={true}
                      onClick={handleBeginningButton}
                      component="span"
                    >
                      Beginning
                    </Button>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                    <Button
                      variant="contained"
                      // disabled={!key}
                      disabled={true}
                      onClick={handleBackButton}
                      startIcon={<ArrowBackIosIcon />}
                      component="span"
                    >
                      Back
                    </Button>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                    <Button
                      disabled={!hyperparam}
                      variant="contained"
                      color={isPlaying ? "secondary" : "primary"}
                      onClick={togglePlayPause}
                      endIcon={
                        isPlaying ? <PauseIcon /> : <ArrowForwardIosIcon />
                      }
                      sx={{ width: 120 }}
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                  </FormControl>
                </FormGroup>
                <svg
                  ref={chartRef}
                  style={{
                    width: WIDTH,
                    height: HEIGHT,
                    border: "0px solid",
                  }}
                ></svg>
              </>
            )}
          </CardContent>
        </Card>
        {/* </Container> */}
      </Box>
    </>
  );
};

MLMVStoryPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MLMVStoryPage;
