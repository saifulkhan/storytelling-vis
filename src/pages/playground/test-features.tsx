import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { schemeTableau10 } from 'd3-scale-chromatic';
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

const FeaturesPage = () => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<
    Record<string, msb.TimeSeriesData>
  >({});

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
        ]),
      ) as Record<string, msb.TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());
      console.log('Cases data: ', casesData);
      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;
    const data = casesData[region];
    const peaks: msb.Peak[] = msb.searchPeaks(data, 1, 'cases', 10);
    console.log('TestFeatures: data = ', data);
    console.log('FeaturesPage: peaks = ', peaks);

    const peaksStartEnd = peaks.map((peak) =>
      msb.sliceTimeseriesByDate(data, peak.getStart(), peak.getEnd()),
    );
    peaksStartEnd.unshift(data);

    console.log('TestFeatures: peaksData = ', peaksStartEnd);

    d3.select(chartRef.current)
      .append('svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .append('g')
      .node();

    // Make sure chartRef.current is not null before using it
    if (chartRef.current) {
      const plot = new msb.LinePlot()
        .setData(peaksStartEnd)
        .setPlotProps({
          xLabel: 'Date',
          title: `${region}`,
          leftAxisLabel: 'Number of cases',
        } as any)
        .setLineProps(
          peaksStartEnd.map((d, i) => {
            return {
              stroke: schemeTableau10[i],
              strokeWidth: 1.5,
            } as any;
          }),
        )
        .setCanvas(chartRef.current)
        .plot();

      peaks.forEach((peak) => {
        console.log(plot.getCoordinates(peak.getDate()));
        // Add null check for chartRef.current
        if (chartRef.current) {
          new msb.Dot()
            .setProps({ color: '#FF5349' } as any)
            .setCanvas(chartRef.current)
            .setCoordinate(plot.getCoordinates(peak.getDate()))
            .show();
        }
      });
    }
  }, [region, casesData]);

  const handleSelectRegion = (event: any) => {
    const region = event.target.value;
    if (region) {
      setRegion(region);
    }
  };

  return (
    <>
      <Head>
        <title>Playground | Features</title>
      </Head>

      <Box
        sx={{
          minHeight: '100%',
          py: 8,
        }}
      >
        <Typography variant="h6">Show peaks</Typography>

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
            {regions.map((d) => (
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

export default FeaturesPage;
