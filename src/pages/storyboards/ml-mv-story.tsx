/**
 ** Implements machine learning multivariate (MLMV) story
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
import { MLMVWorkflow } from "../../utils/storyboards/workflow/MLMVWorkflow";
import { mLData, mLMVNFATable } from "../../services/DataService";
import { MLTimeseriesData } from "../../utils/storyboards/data-processing/TimeseriesData";

const MLMVStoryPage = () => {
  const WIDTH = 1200,
    HEIGHT = 800;
  const KEYS = ["channels", "kernel_size", "layers", "samples_per_class"];

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const [key, setKey] = useState<string>(null);
  const [data, setData] = useState<MLTimeseriesData[]>(null);
  const [nFATable, setNFATable] = useState<any>(null);

  const workflow = new MLMVWorkflow();

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const data = await mLData();
        setData(data);
        setKeys(KEYS);
        const table = await mLMVNFATable();
        setNFATable(table);

        console.log("MLMVStoryPage: useEffect 1: data: ", data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    if (!key || !data || !chartRef.current) return;

    console.log("useEffect 2: key: ", key);
    console.log("useEffect 2: data: ", data);

    workflow
      .setName(key)
      .setData(data)
      .setNFATable(nFATable)
      .setCanvas(chartRef.current)
      .create();

    return () => {};
  }, [key]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setKey(newKey);
    }
  };

  const handleBeginningButton = () => {};

  const handleBackButton = () => {};

  const handlePlayButton = () => {};

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
                        value={key}
                        input={<OutlinedInput label="Select hyperparameter" />}
                      >
                        {keys.map((d) => (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                      <Button
                        variant="contained"
                        disabled={!key}
                        onClick={handleBeginningButton}
                        component="span"
                      >
                        Beginning
                      </Button>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                      <Button
                        variant="contained"
                        disabled={!key}
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
                        disabled={!key}
                        onClick={handlePlayButton}
                        endIcon={<ArrowForwardIosIcon />}
                        component="span"
                      >
                        Play
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
        </Container>
      </Box>
      {/* </DashboardLayout> */}
    </>
  );
};

export default MLMVStoryPage;
