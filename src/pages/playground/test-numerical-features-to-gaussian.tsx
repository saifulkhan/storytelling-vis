import { useEffect, useRef, useState } from 'react';
import { schemeCategory10 } from 'd3-scale-chromatic';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import Head from 'next/head';

// local import
import * as msb from '../..';
// import from npm library
// import * as msb from 'meta-storyboard';

import covid19CasesData from '../../assets/data/covid19-cases-data.json';

const WIDTH = 1500,
  HEIGHT = 500;

const TestNFToGaussianPage = () => {
  const chartRef = useRef(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<
    Record<string, msb.TimeSeriesData>
  >({});

  const plot = useRef(new msb.LinePlot()).current;

  useEffect(() => {
    if (!chartRef.current) return;

    try {
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
      const loadedRegions = Object.keys(casesData).sort();
      setRegions(loadedRegions);
      console.log('Cases data: ', casesData);

      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;

    const data: msb.TimeSeriesData = casesData[region];
    const gauss: msb.TimeSeriesData[] = msb.generateGaussForPeaks(data, '', 10);
    console.debug('data: ', data);
    console.debug('gauss: ', gauss);

    // Add the original timeseries data as the first curve
    gauss.unshift(data);

    new msb.LinePlot()
      .setData(gauss)
      .setPlotProps({
        xLabel: 'Date',
        title: `${region}`,
        leftAxisLabel: 'Number of cases',
        rightAxisLabel: 'Ranks',
      })
      .setLineProps(
        gauss.map((d, i) => {
          if (i === 0) {
            return {
              stroke: '#D3D3D3',
              strokeWidth: 1,
            };
          } else {
            return {
              stroke: schemeCategory10[i - 1],
              strokeWidth: 2,
              onRightAxis: true,
            };
          }
        }),
      )
      .setCanvas(chartRef.current)
      .plot();
  }, [region]);

  const handleSelectRegion = (event: any) => {
    const region = event.target.value;
    if (region) {
      setRegion(region);
    }
  };

  return (
    <>
      <Head>
        <title>Playground | Gaussian NTS</title>
      </Head>

      <Box
        sx={{
          minHeight: '100%',
          py: 8,
        }}
      >
        <Typography variant="h6">
          Show Gaussian of Numerical Timeseries
        </Typography>

        <br />

        <FormControl component="fieldset" variant="standard">
          <InputLabel sx={{ m: 1, width: 300, mt: 0 }} id="select-region-label">
            Select region
          </InputLabel>
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

          <svg
            ref={chartRef}
            style={{
              width: `${WIDTH}px`,
              height: `${HEIGHT}px`,
              border: '1px solid',
            }}
          ></svg>
        </FormControl>
      </Box>
    </>
  );
};

export default TestNFToGaussianPage;
