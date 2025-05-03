import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Head from 'next/head';
import { Box } from '@mui/material';

// local import
import * as msb from '../..';
// import from npm library
// import * as msb from 'meta-storyboard';

import covid19CasesData from '../../assets/data/covid19-cases-data.json';

const TestLinePlotPage = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  const height = 550;
  const width = 1500;

  useEffect(() => {
    if (!chartRef.current) return;
    console.log('useEffect triggered');

    d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .node();

    const casesData = Object.fromEntries(
      Object.entries(covid19CasesData || {}).map(([region, data]) => [
        region,
        data.map(({ date, y }: { date: string; y: number }) => ({
          date: new Date(date),
          y: +y,
        })),
      ]),
    ) as Record<string, msb.TimeSeriesData>;

    const data = casesData['Bolton'];

    if (!chartRef.current) return;

    new msb.LinePlot()
      .setData([data])
      .setName('Bolton')
      .setPlotProps({
        title: 'Example line plot',
        margin: { top: 50, right: 60, bottom: 50, left: 60 },
      })
      .setLineProps([
        {
          stroke: '#355c7d',
          strokeWidth: 1,
          showPoints: false,
          onRightAxis: false,
        },
        {
          stroke: '#99b898',
          strokeWidth: 2,
          showPoints: false,
          onRightAxis: false,
        },
        {
          stroke: '#E1999C',
          strokeWidth: 1,
          showPoints: true,
          onRightAxis: true,
        },
      ])
      .setCanvas(chartRef.current)
      .plot();

    // lineChart.animate(2, 20, 400);
  }, []);

  return (
    <>
      <Head>
        <title>Playground | Line Plot</title>
      </Head>

      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: '100%',
          py: 8,
        }}
      >
        <svg
          ref={chartRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: '1px solid',
          }}
        ></svg>
      </Box>
    </>
  );
};

export default TestLinePlotPage;
