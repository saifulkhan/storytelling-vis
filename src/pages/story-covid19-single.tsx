import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
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

import { getCovid19Data } from "src/services/TimeSeriesDataService";
import { TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { getTableData } from "src/services/FATableService";
import { LinePlot } from "src/components/plots/LinePlot";
import usePlayPauseLoop from "src/hooks/usePlayPauseLoop";
import { DateActionArray } from "src/utils/feature-action/FeatureActionTypes";
import { MSBFeatureActionFactory } from "src/utils/feature-action/MSBFeatureActionFactory";

const Covid19SLStoryPage = () => {
  const WIDTH = 1200,
    HEIGHT = 500;
  const valuetext = (value: number): string => `${value}`; // slider formatted value

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [segment, setSegment] = useState<number>(3);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [regionsData, setRegionsData] = useState<
    Record<string, TimeSeriesPoint[]>
  >({});
  const [tableNFA, setTableNFA] = useState<any>(null);
  const linePlot = useRef(new LinePlot()).current;
  const { isPlaying, togglePlayPause, pause } = usePlayPauseLoop(linePlot);

  useEffect(() => {
    if (!chartRef.current) return;
    console.log("Covid19Story1Page: useEffect 1: fetchData");
    setLoading(true);

    const fetchData = async () => {
      try {
        const allData = await getCovid19Data();
        setRegionsData(allData);
        setRegions(Object.keys(allData).sort());
        const table = await getTableData("COVID-19: Single Location");
        setTableNFA(table);

        console.log("Covid19Story1Page: useEffect 1: allRegionData: ", allData);
      } catch (error) {
        console.error("Covid19Story1Page: Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!region || !regionsData[region] || !chartRef.current) return;

    const regionData = regionsData[region];

    console.log("Covid19Story1Page: useEffect 2: region: ", region);
    console.log("Covid19Story1Page: useEffect 2: regionData: ", regionData);

    const actions: DateActionArray = new MSBFeatureActionFactory()
      .setProps({
        metric: "",
        window: 10,
      })
      .setTable(tableNFA)
      .setData(regionData)
      .create();

    linePlot
      .setData([regionData])
      .setName(region)
      .setPlotProps({
        title: `${region}`,
        xLabel: "Date",
        leftAxisLabel: "Number of cases",
      })
      .setLineProps([])
      .setCanvas(chartRef.current)
      .setActions(actions);

    pause();

    return () => {};
  }, [region, regionsData, tableNFA]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newRegion = event.target.value;
    // prettier-ignore
    // console.log("Covid19Story1Page:handleSelection: newRegion = ", newRegion);
    if (newRegion) {
      setRegion(newRegion);
    }
  };

  const handleChangeSlider = (event: Event, newValue: number | number[]) => {
    const selectedSegment = newValue as number;
    console.log("Covid19Story1Page: selectedSegment = ", selectedSegment);
    if (selectedSegment !== undefined && selectedSegment !== segment) {
      // setSegment(selectedSegment);
      // segmentData(selectedSegment);
      setSegment(1);
      // segmentData(1);
    }
  };

  const handleBeginningButton = () => {};

  const handleBackButton = () => {};

  return (
    <>
      <Head>
        <title>Storyboard | COVID-19 Single Location</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        {/* <Container> */}
        <Card sx={{ minWidth: 1200 }}>
          <CardHeader
            avatar={
              <Avatar style={{ backgroundColor: blue[500] }}>
                <AutoStoriesIcon />
              </Avatar>
            }
            title="Covid19: Single Location Story"
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
                  <InputLabel sx={{ m: 1, mt: 0 }} id="segment-slider-label">
                    Set segment value
                  </InputLabel>
                  <FormControl sx={{ m: 1, width: 300, mt: 0 }} size="small">
                    <Slider
                      // labelId="segment-slider"
                      disabled={true}
                      aria-label="Segments"
                      defaultValue={3}
                      getAriaValueText={valuetext}
                      step={1}
                      marks
                      min={0}
                      max={5}
                      value={segment}
                      valueLabelDisplay="auto"
                      onChange={handleChangeSlider}
                    />
                  </FormControl>

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
                      // disabled={!region}
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
                      // disabled={!region}
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

export default Covid19SLStoryPage;
