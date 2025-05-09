import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';

import * as msb from '../..';

const TestActionsPage = () => {
  const chartRef = useRef(null);

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const height = 500 - margin.top - margin.bottom;
  const width = 1000 - margin.left - margin.right;

  useEffect(() => {
    if (!chartRef.current) return;
    let ignore = false;

    if (!ignore) {
      const src: msb.Coordinate = [400, 300];
      const dst: msb.Coordinate = [400, 200];
      const dst1: msb.Coordinate = [400, 150];
      const dst2: msb.Coordinate = [100, 100];
      const dst3: msb.Coordinate = [100, 300];

      //
      // Test example action objects
      //
      const dot = new msb.Dot()
        .setProps({
          size: 5,
          color: '#FF0000',
          opacity: 0.5,
        } as any)
        .setCanvas(chartRef.current)
        .setCoordinate([src, dst])
        .show();

      const circle = new msb.Circle()
        .setProps({
          size: 10,
          color: 'green',
          opacity: 1,
        } as any)
        .setCanvas(chartRef.current)
        .setCoordinate([src, dst])
        .show();

      const textBox1 = new msb.TextBox()
        .setProps({
          title: '17-02-2024',
          message:
            'By 17-02-2024, the number of cases continued to climb higher in Oxford.',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          backgroundColor: 'lightgrey',
        } as any)
        .setCanvas(chartRef.current)
        .setCoordinate([src, dst1])
        .show();

      const connector = new msb.Connector()
        .setProps({} as any)
        .setCanvas(chartRef.current)
        .setCoordinate([src, dst])
        .show();

      //
      // Test example action group
      //

      const textbox2 = new msb.TextBox().setProps({
        horizontalAlign: 'right',
        verticalAlign: 'top',
        backgroundColor: 'lightgrey',
        width: 100,
      } as any);
      const actions = [
        new msb.Dot().setProps({} as any),
        new msb.Circle().setProps({} as any),
        textbox2,
      ];

      const group = new msb.ActionGroup()
        .group(actions)
        .setCanvas(chartRef.current)
        .setCoordinate([src, dst2])
        .show();

      //
      // Test move textbox
      //
      const animate = async () => {
        textbox2.move(dst3, 1000, 2000);
      };
      animate();
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Playground | Actions</title>
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
          style={{ width: width, height: height, border: '1px solid' }}
        ></svg>
      </Box>
    </>
  );
};

export default TestActionsPage;
