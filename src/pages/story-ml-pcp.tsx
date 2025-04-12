import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
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

import { ParallelCoordinatePlot } from "src/components/plots/ParallelCoordinatePlot";
import usePlayPauseLoop from "src/hooks/usePlayPauseLoop";
import { sortTimeseriesData } from "src/utils/common";
import { MSBFeatureActionFactory } from "src/utils/feature-action/MSBFeatureActionFactory";
import { TimelineMSBActions } from "src/types/TimelineMSBActions";
import { TimeSeriesData } from "src/types/TimeSeriesPoint";

import mlTrainingData from "../../assets/data/ml-training-data.json";
import mlNumFATable from "../../assets/data/ml-numerical-fa-table-pcp.json";

const StoryMLPCP = () => {
  const WIDTH = 1200,
    HEIGHT = 800;
  const HYPERPARAMS = [
    "channels",
    "kernel_size",
    "layers",
    "samples_per_class",
  ];

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hyperparam, setHyperparam] = useState<string>("");
  const [mlData, setMLData] = useState<TimeSeriesData>([]);
  const [numericalFATable, setNumericalFATable] = useState<any>({});

  const plot = useRef(new ParallelCoordinatePlot()).current;
  const { isPlaying, togglePlayPause, pause } = usePlayPauseLoop(plot);

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    // load ML training data
    setMLData(
      mlTrainingData.map(({ date, ...rest }) => ({
        date: new Date(date),
        ...rest,
      }))
    );

    // load feature-action table
    setNumericalFATable(mlNumFATable);

    console.log("ML data: ", mlData);
    console.log("Numerical feature-action table data: ", numericalFATable);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hyperparam || !mlData || !chartRef.current) return;

    const data = sortTimeseriesData(mlData, hyperparam);
    console.log(`Selected hyperparameter ${hyperparam}'s data: ${data}`);

    // build story based on selected hyperparameter's data and feature-action table

    // create timeline actions
    const timelineMSBActions: TimelineMSBActions = new MSBFeatureActionFactory()
      .setFAProps({ metric: "accuracy", window: 0 })
      .setData(data) // <- timeseries data
      .setTable(numericalFATable) // <- feature-action table
      .create();

    // provide the data, timeline MSB actions, and settings to the PCP
    plot
      .setPlotProps({ margin: { top: 150, right: 50, bottom: 60, left: 60 } })
      .setName(hyperparam) // <- selected hyperparameter
      .setData(data) // <- timeseries data
      .setCanvas(chartRef.current)
      .setActions(timelineMSBActions);

    // pause the animation, start when play button is clicked
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

  return (
    <>
      <Head>
        <title>Story | ML Multivariate</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Card sx={{}}>
          <CardHeader
            avatar={
              <Avatar style={{ backgroundColor: blue[500] }}>
                <AutoStoriesIcon />
              </Avatar>
            }
            title="Story: Machine Learning Multivariate"
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
      </Box>
    </>
  );
};

export default StoryMLPCP;
