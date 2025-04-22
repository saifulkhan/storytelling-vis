import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Slider,
} from '@mui/material';

import { TimeSeriesData } from '../../types';
import {
  CategoricalFeature,
  generateGaussForPeaks,
  Peak,
  searchPeaks,
  segmentTimeSeries,
} from '../../utils';
import {
  combineSeries,
  segmentByImportantPeaks,
  maxAcrossSeries,
  generateGaussForCatFeatures,
} from '../../utils';
import { Dot, getSchemeTableau10, LinePlot, LineProps } from '../../components';

import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19CategoricalData from '../../assets/feature-action-table/covid-19-categorical-table-1.json';

const WIDTH = 1500,
  HEIGHT = 500;

const TestCombinedGaussianPage = () => {
  const chartRef = useRef(null);
  const [segment, setSegment] = useState<number>(3);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<Record<string, TimeSeriesData>>(
    {},
  );
  const [categoricalFeatures, setCategoricalFeatures] = useState<
    CategoricalFeature[]
  >([]);

  // slider formatted value
  const valuetext = (value: number) => `${value}`;

  useEffect(() => {
    if (!chartRef.current) return;

    try {
      // 1. Get timeseries data for all regions.
      const casesData = Object.fromEntries(
        Object.entries(covid19CasesData || {}).map(([region, data]) => [
          region,
          data.map(({ date, y }: { date: string; y: number }) => ({
            date: new Date(date),
            y: +y,
          })),
        ]),
      ) as Record<string, TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());
      console.log(
        `${Object.keys(casesData).length} regions' data: `,
        casesData,
      );

      // 2. Get categorical features
      setCategoricalFeatures(
        covid19CategoricalData.map((d) =>
          new CategoricalFeature()
            .setDate(new Date(d.date))
            .setRank(d.rank)
            .setDescription(d.event),
        ),
      );
      console.log('Categorical features: ', categoricalFeatures);

      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;

    const data = casesData[region];

    const ntsGauss: TimeSeriesData[] = generateGaussForPeaks(data);
    const ctsGauss: TimeSeriesData[] = generateGaussForCatFeatures(
      data,
      categoricalFeatures,
    );
    const ntsBoundGauss: TimeSeriesData = maxAcrossSeries(data, ntsGauss);
    const ctsBoundGauss: TimeSeriesData = maxAcrossSeries(data, ctsGauss);

    console.log('ntsBoundGauss:', ntsBoundGauss);
    console.log('ctsBoundGauss:', ctsBoundGauss);

    const combined = combineSeries(data, [ntsBoundGauss, ctsBoundGauss]);
    console.log('combined:', combined);

    const plot = new LinePlot()
      .setData([data, ntsBoundGauss, ctsBoundGauss, combined])
      .setPlotProps({
        xLabel: 'Date',
        title: `${region}`,
        leftAxisLabel: 'Number of cases',
        rightAxisLabel: 'Rank',
      })
      .setLineProps(
        ctsBoundGauss.map((d, i) => {
          if (i === 0) {
            return {
              stroke: '#D3D3D3',
              strokeWidth: 2,
              showPoints: false,
            } as LineProps;
          } else {
            return {
              stroke: getSchemeTableau10(i - 1),
              strokeWidth: 2,
              onRightAxis: true,
              showPoints: false,
            } as LineProps;
          }
        }),
      )
      .setCanvas(chartRef.current)
      .plot();

    // Use deltaMax = 0.15 (15% of data length) as the minimum gap between peaks
    const [peaks, ordering]: [Peak[], { idx: number; h: number }[]] =
      segmentByImportantPeaks(combined, 0.15);

    console.log('peaks:', peaks);
    console.log('ordering:', ordering);

    const peaksIndices = segmentTimeSeries(combined, segment, 0.15);
    console.log('peaksIndices:', peaksIndices);

    peaks.forEach((d: Peak, i: number) => {
      if (!chartRef.current) return;

      console.log('i:', i);
      new Dot()
        .setProps({
          size: 8,
          color: 'blue',
          opacity: i < segment - 1 ? 1 : 0.2,
        })
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(d.getDate(), 3))
        .show();
    });

    peaksIndices.forEach((d: number) => {
      if (!chartRef.current) return;
      new Dot()
        .setProps({
          size: 10,
          color: 'red',
          opacity: 0.5,
        })
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(data[d].date, 3))
        .show();
    });

    return () => {};
  }, [region, segment]);

  const handleSelectRegion = (event: SelectChangeEvent) => {
    const region = event.target.value;
    if (region) {
      setRegion(region);
    }
  };

  const handleChangeSlider = (
    _event: React.SyntheticEvent | Event,
    value: number | number[],
  ) => {
    const selectedSegment = typeof value === 'number' ? value : value[0];
    console.log('segment = ', selectedSegment);
    if (selectedSegment !== undefined && selectedSegment !== segment) {
      setSegment(selectedSegment);
    }
  };

  return (
    <>
      <title>Playground | Gaussian Combined</title>

      <Box
        sx={{
          minHeight: '100%',
          py: 8,
        }}
      >
        <FormGroup
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
              alignItems: 'center',
            },
          }}
        >
          <InputLabel sx={{ m: 1, width: 100, mt: 0 }} id="select-region-label">
            Select region
          </InputLabel>
          <FormControl component="fieldset" variant="standard">
            <Select
              sx={{ m: 1, width: 300, mt: 0 }}
              id="select-region-label"
              displayEmpty
              onChange={handleSelectRegion}
              value={region}
              input={<OutlinedInput label="Select region" />}
            >
              {regions?.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <InputLabel sx={{ m: 1, mt: 0 }} id="segment-slider-label">
            Set segment value
          </InputLabel>
          <FormControl sx={{ m: 1, width: 300, mt: 0 }} size="small">
            <Slider
              aria-label="Segments"
              defaultValue={3}
              getAriaValueText={valuetext}
              step={1}
              marks
              min={0}
              max={10}
              value={segment}
              valueLabelDisplay="auto"
              onChange={handleChangeSlider}
            />
          </FormControl>

          <svg
            ref={chartRef}
            style={{
              width: `${WIDTH}px`,
              height: `${HEIGHT}px`,
              border: '1px solid',
            }}
          ></svg>
        </FormGroup>
      </Box>
    </>
  );
};

export default TestCombinedGaussianPage;
