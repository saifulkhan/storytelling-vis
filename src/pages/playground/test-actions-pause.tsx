import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';

import * as msb from '../..';

const TestActionsPause = () => {
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
      // Test example action group
      //

      const textbox2 = new msb.TextBox().setProps({
        horizontalAlign: 'right',
        verticalAlign: 'top',
        backgroundColor: 'lightgrey',
        width: 100,
      });
      const actions = [
        new msb.Dot().setProps(),
        new msb.Circle().setProps(),
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

export default TestActionsPause;
