/**
 ** Implements machine learning mirrored bar chart story
 **/

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

import {
  MirroredBarChart,
  MirroredBarChartData,
} from "src/components/plots/MirroredBarChart";
import usePlayPauseLoop from "src/hooks/usePlayPauseLoop";
import { sortTimeseriesData } from "src/utils/common";
import { TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { TimelineMSBActions } from "src/types/TimelineMSBActions";
import { MSBFeatureActionFactory } from "src/utils/feature-action/MSBFeatureActionFactory";

import mlTrainingData from "../../assets/data/ml-training-data.json";
import mlNumFATable from "../../assets/data/ml-numerical-fa-table-1.json";

const StoryMLMirroredBar = () => {
  const WIDTH = 1200,
    HEIGHT = 800;
  const HYPERPARAMS = [
    "channels",
    "kernel_size",
    "layers",
    "samples_per_class",
  ];

  const chartRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hyperparam, setHyperparam] = useState<string>("");
  const [mlData, setMLData] = useState<TimeSeriesPoint[]>([]);
  const [numericalFATable, setNumericalFATable] = useState<any>({});

  const plot = useRef(new MirroredBarChart()).current;
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

    // convert to MirroredBarChartData which will display mean_test_accuracy & mean_training_accuracy
    // TODO: may not be required
    const chartData: MirroredBarChartData[] = data.map((item) => ({
      date: new Date(item.date),
      y: (item as any)[hyperparam] as number, // Parameter value using type assertion
      mean_test_accuracy: item.mean_test_accuracy,
      mean_training_accuracy: item.mean_training_accuracy,
    }));

    // build story based on selected hyperparameter's data and feature-action table

    // create timeline actions
    const timelineMSBActions: TimelineMSBActions = new MSBFeatureActionFactory()
      .setFAProps({ metric: "accuracy", window: 0 })
      .setData(data) // <- timeseries data
      .setTable(numericalFATable) // <- feature-action table
      .create();

    // provide the data, timeline MSB actions, and settings to the PCP
    // plot
    //   .setPlotProps({ margin: { top: 150, right: 50, bottom: 60, left: 60 } })
    //   .setName(hyperparam) // <- selected hyperparameter
    //   .setData(data) // <- timeseries data
    //   .setCanvas(chartRef.current)
    //   .setActions(timelineMSBActions);

    // pause the animation, start when play button is clicked
    pause();

    return () => {};
  }, [hyperparam, mlData]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setHyperparam(newKey);
    }
  };

  const handleBeginningButton = () => {
    // Use the togglePlayPause method which is properly typed
    if (isPlaying) {
      pause();
    }
    // Reset to beginning if needed
    if (plot) {
      // Call any reset or beginning method that might be available
      console.log("Reset to beginning");
    }
  };

  const handleBackButton = () => {
    // Use the togglePlayPause method which is properly typed
    if (isPlaying) {
      pause();
    }
    // Go back if needed
    if (plot) {
      // Call any back method that might be available
      console.log("Go back");
    }
  };

  const handlePlayButton = () => {
    togglePlayPause();
  };

  return (
    <>
      <Head>
        <title key="title">Story | ML Provenance</title>
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
            title="Story: Machine Learning Provenance"
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

export default StoryMLMirroredBar;
