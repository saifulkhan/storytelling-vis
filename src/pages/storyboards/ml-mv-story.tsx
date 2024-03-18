/**
 ** Implements machine learning multivariate story
 **/

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
import { makeStyles } from "@mui/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { blue } from "@mui/material/colors";

const MLMVStoryPage = () => {
  const WIDTH = 1200,
    HEIGHT = 500;

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(null);
  const [segment, setSegment] = useState<number>(3);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>(null);
  const [allRegionData, setAllRegionData] = useState<Record<string, any>>({});
  const [data, setData] = useState<any>(null); // Explicitly use null for uninitialized state
  const [tableNFA, setTableNFA] = useState<any>(null);

  const storyBuilder = new MLStory1Builder();

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const allData = await covid19Data1();
        setAllRegionData(allData);
        setRegions(Object.keys(allData).sort());
        setRegion("Aberdeenshire");
        const table = await covid19NumericalTable1();
        setTableNFA(table);

        console.log("useEffect 1: allRegionData: ", allData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChangeSlider = (event) => {
    const selectedSegment = event.target.value;
    console.log("MLMultivariateStory: selectedSegment = ", selectedSegment);
    if (selectedSegment && selectedSegment !== segment) {
      // setSegment(selectedSegment);
      // segmentData(selectedSegment);
      setSegment(1);
      // segmentData(1);
    }
  };

  const handleSelection = (event: SelectChangeEvent) => {
    const selectedName = event.target.value;
    // prettier-ignore
    console.log("MLMultivariateStory:handleSelection: selectedRegion = ", selectedName);
    if (selectedName) {
      storyBuilder.setName(selectedName).setCanvas("#chartId").build();

      //createTimeSeriesSVG("#chart1");
      //setRegion(selectedRegion);
      //setAnimationCounter(0);
    }
  };

  const handleBeginningButton = () => {
    const count = 0;

    setAnimationCounter(count);
    console.log("MLMultivariateStory: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  const handleBackButton = () => {
    const count = animationCounter - 1;
    if (count < 0) return;

    setAnimationCounter(count);
    console.log("MLMultivariateStory: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  const handlePlayButton = () => {
    const count = animationCounter + 1;
    setAnimationCounter(count);
    console.log("MLMultivariateStory: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  return (
    <>
      <Head>
        <title>ML Multivariate Story</title>
      </Head>
      {/* <DashboardLayout> */}
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container>
          <Card sx={{}}>
            <CardHeader
              avatar={
                <Avatar style={{ backgroundColor: blue[500] }}>
                  <AutoStoriesIcon />
                </Avatar>
              }
              title="ML Multivariate Story"
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
                        value={region}
                        input={<OutlinedInput label="Select hyperparameter" />}
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
                        disabled={!region}
                        onClick={handleBeginningButton}
                        component="span"
                      >
                        Beginning
                      </Button>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                      <Button
                        variant="contained"
                        disabled={!region}
                        onClick={handleBackButton}
                        startIcon={<ArrowBackIosIcon />}
                        component="span"
                      >
                        Back
                      </Button>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                      <Button
                        variant="contained"
                        disabled={!region}
                        onClick={handlePlayButton}
                        endIcon={<ArrowForwardIosIcon />}
                        component="span"
                      >
                        Play
                      </Button>
                    </FormControl>
                  </FormGroup>
                  <div id="chartId" />
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      {/* </DashboardLayout> */}
    </>
  );
};

export default MLMVStoryPage;
