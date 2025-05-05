import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
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
import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19NumericalFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';
import covid19CategoricalFATable from '../../assets/feature-action-table/covid-19-categorical-fa-table.json';
import covid19CategoricalData from '../../assets/feature-action-table/covid-19-categorical-table.json';

const StoryCovid19Gaussian = () => {
  const WIDTH = 1200,
    HEIGHT = 500;
  const valuetext = (value: number): string => `${value}`; // slider formatted value

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [numSegment, setNumSegment] = useState<number>(4);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<
    Record<string, msb.TimeSeriesData>
  >({});
  const [numericalFATable, setNumericalFATable] = useState<any>(null);
  const [categoricalEventsData, setCategoricalEventsData] = useState<any>(null);
  const [categoricalFATable, setCategoricalFATable] = useState<any>(null);

  const plot = useRef(new msb.LinePlot()).current;
  const [controller, isPlaying] = useControllerWithState(
    msb.PlayPauseController,
    plot,
  );

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    try {
      // 1.1 Load timeseries data for all regions.
      const casesData = Object.fromEntries(
        Object.entries(covid19CasesData || {}).map(([region, data]) => [
          region,
          data.map(({ date, y }: { date: string; y: number }) => ({
            date: new Date(date),
            y: +y,
          })),
        ]),
      ) as Record<string, msb.TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());

      // 1.2 Load numerical feature-action table
      setNumericalFATable(covid19NumericalFATable);
      // 1.3 Load categorical events data and feature-action table
      setCategoricalEventsData(covid19CategoricalData);
      setCategoricalFATable(covid19CategoricalFATable);

      console.log('Cases data: ', casesData);
      console.log('Numerical feature-action table data: ', numericalFATable);

      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;

    // reset the plot when region or slider changes
    if (plot.svg) {
      plot.reset();
    }

    // 1.1 Get timeseries data of a single region.
    const data = casesData[region];
    // console.log(`Selected region ${region}'s data: ${data}`);

    // 2. Create timeline actions
    const timelineActions: msb.TimelineAction[] = new msb.FeatureActionFactory()
      .setProps({
        metric: 'Number of cases',
        window: 10,
      })
      .setData(data)
      .setNumericalFeatures(numericalFATable) // <- feature-action table
      .setCategoricalFeatures(categoricalEventsData, categoricalFATable)
      .segment(numSegment, 'gmm')
      .create();

    console.log('StoryCovid19Gaussian: timelineActions: ', timelineActions);
    // 3. Create story in a line plot
    plot
      .setData([data]) // <- timeseries data
      .setName(region) // <- selected region
      .setPlotProps({
        title: `${region}`,
        xLabel: 'Date',
        leftAxisLabel: 'Number of cases',
      } as any)
      .setLineProps([])
      .setCanvas(chartRef.current)
      // .plot() // <- draw the static plot, useful for testing
      .setActions(timelineActions)
      .animate();

    // 4. Pause the animation, start when play button is clicked
    controller.pause();

    return () => {};
  }, [region, casesData, numericalFATable, categoricalEventsData, numSegment]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newRegion = event.target.value;
    if (newRegion) {
      setRegion(newRegion);
    }
  };

  const handleChangeSlider = (event: Event, newValue: number | number[]) => {
    const selectedSegment = newValue as number;
    if (selectedSegment !== undefined && selectedSegment !== numSegment) {
      setNumSegment(selectedSegment);
    }
  };

  const handleBeginningButton = () => {};
  const handleBackButton = () => {};

  return (
    <>
      <Head>
        <title>Story | COVID-19 (Gaussian)</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
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
                  <InputLabel sx={{ m: 1, mt: 0 }} id="segment-slider-label">
                    Set segment value
                  </InputLabel>
                  <FormControl sx={{ m: 1, width: 300, mt: 0 }} size="small">
                    <Slider
                      disabled={false}
                      aria-label="Segments"
                      defaultValue={4}
                      getAriaValueText={valuetext}
                      step={1}
                      marks
                      min={0}
                      max={10}
                      value={numSegment}
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

export default StoryCovid19Gaussian;
