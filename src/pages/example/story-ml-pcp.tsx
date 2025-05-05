import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
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
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseIcon from '@mui/icons-material/Pause';
import { blue } from '@mui/material/colors';

// local import
import * as msb from '../..';
// import from npm library
// import * as msb from 'meta-storyboard';

import { useControllerWithState } from '../useControllerWithState';
import mlTrainingData from '../../assets/data/ml-training-data.json';
import mlNumFATable from '../../assets/feature-action-table/ml-numerical-fa-table-pcp.json';

const StoryMLPCP = () => {
  const WIDTH = 1200,
    HEIGHT = 1000;
  const HYPERPARAMS = [
    'channels',
    'kernel_size',
    'layers',
    'samples_per_class',
  ];

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hyperparam, setHyperparam] = useState<string>('');
  const [mlData, setMLData] = useState<msb.TimeSeriesData>([]);
  const [numericalFATable, setNumericalFATable] = useState<any>({});

  const plot = useRef(new msb.ParallelCoordinatePlot()).current;
  const [controller, isPlaying] = useControllerWithState(
    msb.PlayPauseController,
    plot,
  );

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    // 1.1 Load ML training data
    setMLData(
      mlTrainingData.map(({ date, ...rest }) => ({
        date: new Date(date),
        ...rest,
      })),
    );

    // 1.2 Load feature-action table
    setNumericalFATable(mlNumFATable);

    console.log('ML data: ', mlData);
    console.log('Numerical feature-action table data: ', numericalFATable);

    setHyperparam('channels');

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hyperparam || !mlData || !chartRef.current) return;

    // reset the plot when hyperparameter changes
    if (plot.svg) {
      plot.reset();
    }

    const data = msb.sortTimeseriesData(mlData, hyperparam);
    console.log(`Selected hyperparameter ${hyperparam}'s data: ${data}`);

    // build story based on selected hyperparameter's data and feature-action table

    // 2. Create timeline actions
    const timelineActions: msb.TimelineAction[] = new msb.FeatureActionFactory()
      .setProps({ metric: 'accuracy', window: 0 })
      .setData(data) // <- timeseries data
      .setNumericalFeatures(numericalFATable) // <- feature-action table
      .create();

    // 3. Create PCP
    plot
      .setPlotProps({ margin: { top: 150, right: 50, bottom: 60, left: 60 } })
      .setName(hyperparam) // <- selected hyperparameter
      .setData(data) // <- timeseries data
      .setCanvas(chartRef.current)
      //.plot(); // static plot
      .setActions(timelineActions)
      .animate();

    // 4. Pause the animation, start when play button is clicked
    controller.pause();

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
          backgroundColor: 'background.default',
          minHeight: '100%',
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
          <CardContent sx={{ pt: '8px' }}>
            {loading ? (
              <Box sx={{ height: 40 }}>
                <Fade
                  in={loading}
                  style={{
                    transitionDelay: loading ? '800ms' : '0ms',
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
                      xs: 'column',
                      sm: 'row',
                      alignItems: 'center',
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
                      color={isPlaying ? 'secondary' : 'primary'}
                      // 4. Play/pause button
                      onClick={() => controller.togglePlayPause()}
                      endIcon={
                        isPlaying ? <PauseIcon /> : <ArrowForwardIosIcon />
                      }
                      sx={{ width: 120 }}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                  </FormControl>
                </FormGroup>
                <svg
                  ref={chartRef}
                  style={{
                    width: WIDTH,
                    height: HEIGHT,
                    border: '0px solid',
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
