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

import { TimeSeriesData, TimelineMSBActions } from "../../types";
import { LinePlot } from "../../components";
import { usePlayPauseLoop } from "../../hooks";
import { MSBFeatureActionFactory } from "../../utils";

import covid19CasesData from "../../assets/data/covid19-cases-data.json";
import covid19NumFATable from "../../assets/feature-action-table/covid-19-numerical-fa-table.json";

const StoryCovid19Single = () => {
  const WIDTH = 1200,
    HEIGHT = 500;

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [casesData, setCasesData] = useState<Record<string, TimeSeriesData>>(
    {}
  );
  const [numericalFATable, setNumericalFATable] = useState<any>(null);

  const plot = useRef(new LinePlot()).current;
  const { isPlaying, togglePlayPause, pause } = usePlayPauseLoop(plot);

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    try {
      
      // 1.1 Get timeseries data for all regions.
      const casesData = Object.fromEntries(
        Object.entries(covid19CasesData || {}).map(([region, data]) => [
          region,
          data.map(({ date, y }: { date: string; y: number }) => ({
            date: new Date(date),
            y: +y,
          })),
        ])
      ) as Record<string, TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());

      // 1.2 Load feature-action table a JSON file.
      setNumericalFATable(covid19NumFATable);

      console.log("Cases data: ", casesData);
      console.log("Numerical feature-action table data: ", numericalFATable);
    } catch (error) {
      console.error("Failed to fetch data; error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;

    // 1.1.a Get timeseries data of a single region.
    const data = casesData[region];
    console.log(`Selected region ${region}'s data: ${data}`);

    // 2. Create timeline actions
    const timelineMSBActions: TimelineMSBActions = new MSBFeatureActionFactory()
      .setFAProps({
        metric: "Number of cases",
        window: 10,
      })
      .setTable(numericalFATable) // <- feature-action table
      .setData(data) // <- timeseries data
      .create();

    // 3. Create story in a line plot
    plot
      .setData([data]) // <- timeseries data
      .setName(region) // <- selected region
      .setPlotProps({
        title: `${region}`,
        xLabel: "Date",
        leftAxisLabel: "Number of cases",
      })
      .setLineProps([])
      .setCanvas(chartRef.current)
      // .plot() // <- draw the static plot, useful for testing
      .setActions(timelineMSBActions);

    // 4. Pause the animation, start when play button is clicked
    pause();

    return () => {};
  }, [region, casesData, numericalFATable]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newRegion = event.target.value;
    if (newRegion) {
      setRegion(newRegion);
    }
  };

  const handleBeginningButton = () => {};
  const handleBackButton = () => {};

  return (
    <>
      <Head>
        <title>Story | COVID-19 Single Location</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Card sx={{ minWidth: 1200 }}>
          <CardHeader
            avatar={
              <Avatar style={{ backgroundColor: blue[500] }}>
                <AutoStoriesIcon />
              </Avatar>
            }
            title="Story: Covid19 Single Location"
            subheader="Choose a segment value, a region, and click play to animate the story"
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
                      Select region
                    </InputLabel>
                    <Select
                      labelId="select-region-label"
                      id="select-region-label"
                      displayEmpty
                      onChange={handleSelection}
                      value={region}
                      input={<OutlinedInput label="Select region" />}
                    >
                      {regions.map((d) => (
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
                      disabled={!region}
                      variant="contained"
                      color={isPlaying ? "secondary" : "primary"}
                      // 4. Play/pause button
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

export default StoryCovid19Single;
