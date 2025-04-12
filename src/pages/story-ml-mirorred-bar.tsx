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
  MirroredBarChartProps,
} from "src/components/plots/MirroredBarChart";
import usePlayPauseLoop from "src/hooks/usePlayPauseLoop";
import useSynchronizedPlots from "src/hooks/useSynchronizedPlots";
import { sortTimeseriesData } from "src/utils/common";
import { TimeSeriesData, TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { TimelineMSBActions } from "src/types/TimelineMSBActions";
import { MSBFeatureActionFactory } from "src/utils/feature-action/MSBFeatureActionFactory";
import { LinePlot } from "src/components/plots/LinePlot";

import mlTrainingData from "../../assets/data/ml-training-data.json";
import mlNumFATable from "../../assets/data/ml-numerical-fa-table-line.json";

const StoryMLMirroredBar = () => {
  const WIDTH = 1200,
    HEIGHT = 600;
  const HYPERPARAMS = [
    "channels",
    "kernel_size",
    "layers",
    "samples_per_class",
  ];

  const chartRefLine = useRef<SVGSVGElement>(null);
  const chartRefMirrored = useRef<SVGSVGElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHyperparam, setSelectedHyperparam] = useState<string>("");
  const [mlData, setMLData] = useState<TimeSeriesData>([]);
  const [numericalFATable, setNumericalFATable] = useState<any>({});

  const linePlot = useRef(new LinePlot()).current;
  const mirroredBarChart = useRef(new MirroredBarChart()).current;

  // control both plots together
  const { isPlaying, togglePlayPause, pause } = useSynchronizedPlots([linePlot, mirroredBarChart]);

  useEffect(() => {
    if (
      !chartRefLine.current || 
      !chartRefMirrored.current
    ) return;
    setLoading(true);

    // load data
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
    if (
      !selectedHyperparam ||
      !mlData ||
      !chartRefLine.current ||
      !chartRefMirrored.current
    )
      return;

    let data = sortTimeseriesData(mlData, selectedHyperparam);
    const y1AxisName = "mean_test_accuracy";
    const y2AxisName = selectedHyperparam;
   
    console.log(`Selected hyperparameter ${selectedHyperparam}'s data:`, data);


    // build story based on selected hyperparameter's data and feature-action table

    // create timeline actions
    const timelineMSBActions: TimelineMSBActions = new MSBFeatureActionFactory()
      .setFAProps({ metric: "accuracy", window: 0 })
      .setData(data) // <- timeseries data
      .setTable(numericalFATable) // <- feature-action table
      .create();

 
    linePlot
      .setData([data.map(d => ({ ...d, y: d[y1AxisName] }))]) // <- timeseries data
      .setName(selectedHyperparam) // <- selected hyperparam
      .setPlotProps({
        title: `${selectedHyperparam}`,
        xLabel: "Date",
        leftAxisLabel: y1AxisName,
      })
      .setLineProps([])
      .setCanvas(chartRefLine.current)
      // .plot() // <- draw the static plot, useful for testing
      .setActions(timelineMSBActions);
  

    // provide the data, timeline MSB actions, and settings to the PCP
    mirroredBarChart
      .setProps({y1Label: y1AxisName, y2Label: y2AxisName})
      .setName(selectedHyperparam) // <- selected hyperparameter
      .setData(data) // <- timeseries data
      .setCanvas(chartRefMirrored.current)
      //.plot(); // <- draw the static plot, useful for testing
      .setActions(timelineMSBActions);

    // pause the animation, start when play button is clicked
    pause();

    return () => {};
  }, [selectedHyperparam, mlData]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setSelectedHyperparam(newKey);
    }
  };

  const handleBeginningButton = () => {};
  const handleBackButton = () => {};

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
                      value={selectedHyperparam}
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
                      disabled={!selectedHyperparam}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                  }}
                >
                  <svg
                    ref={chartRefLine}
                    style={{
                      width: WIDTH,
                      height: HEIGHT * .8,
                      border: "0px solid",
                    }}
                  ></svg>
                  <svg
                    ref={chartRefMirrored}
                    style={{
                      width: WIDTH,
                      height: HEIGHT,
                      border: "0px solid",
                    }}
                  ></svg>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default StoryMLMirroredBar;
