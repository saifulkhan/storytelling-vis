/**
 ** Implements machine learning mirrored bar chart story
 **/

import { useEffect, useState, useRef } from "react";
import type { ReactElement, ReactNode } from "react";
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
import { getMLData } from "../../services/TimeSeriesDataService";
import { getTableData } from "../../services/FATableService";
import { MirroredBarChart, MirroredBarChartData } from "../../components/storyboard/plots/MirroredBarChart";
import usePlayPauseLoop from "../../hooks/usePlayPauseLoop";
import { sortTimeseriesData } from "../../utils/common";
 
const MLMirroredBarStoryPage = () => {
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
  const [data, setData] = useState<any>({});
  const [table, setTable] = useState<any>({});

  // Initialize the plot with useRef to maintain the same instance across renders
  const plotRef = useRef<MirroredBarChart | null>(null);
  if (!plotRef.current) {
    plotRef.current = new MirroredBarChart();
  }
  const plot = plotRef.current;
  
  // Use the plot instance with the usePlayPauseLoop hook
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

        console.log("MLMirroredBarStoryPage: useEffect 1: data: ", data);
        console.log("MLMirroredBarStoryPage: useEffect 1: table: ", table);
      } catch (error) {
        console.error("MLMirroredBarStoryPage: Failed to fetch data:", error);
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

    console.log("MLMirroredBarStoryPage: useEffect 2: key: ", hyperparam);
    console.log("MLMirroredBarStoryPage: useEffect 2: data: ", data[hyperparam]);

    // FeatureActionBuilder takes TimeseriesData, so we need to transform it
    const _data = sortTimeseriesData(data, hyperparam);

    // Convert TimeSeriesPoint to MirroredBarChartData
    const chartData: MirroredBarChartData[] = _data.map(item => ({
      date: new Date(item.date),
      y: (item as any)[hyperparam] as number, // Parameter value using type assertion
      mean_test_accuracy: item.mean_test_accuracy,
      mean_training_accuracy: item.mean_training_accuracy
    }));

    // Create simplified annotations for the chart
    const annotations = _data.map((item, index) => ({
      start: index,
      end: index,
      text: `${new Date(item.date).toLocaleDateString()}: ${item.mean_test_accuracy?.toFixed(2)}`
    }));

    plot
      .svg(chartRef.current)
      .title(`${hyperparam.toUpperCase()} Parameter Analysis`)
      .xLabel("Date")
      .yLabel1("Test Accuracy")
      .yLabel2("Parameter Value")
      .color1("steelblue")
      .color2("darkgreen")
      .data1(chartData)
      .margin({ top: 150, right: 50, bottom: 60, left: 60 })
      .annotations(annotations)
      .plot();

    pause();

    return () => {};
  }, [hyperparam, data]);

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
        <title key="title">ML Mirrored Bar Chart Story</title>
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
            title="ML Mirrored Bar Chart Story"
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
                      disabled={!hyperparam}
                      onClick={handleBeginningButton}
                      component="span"
                    >
                      Beginning
                    </Button>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                    <Button
                      variant="contained"
                      disabled={!hyperparam}
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
                      onClick={handlePlayButton}
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

// Define the layout for this page
MLMirroredBarStoryPage.getLayout = function getLayout(page: ReactElement): ReactNode {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MLMirroredBarStoryPage;
