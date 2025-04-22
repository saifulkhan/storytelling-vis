import { useEffect, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Head from 'next/head';

import { generateGaussForCatFeatures, CategoricalFeature } from '../../utils';
import { TimeSeriesData } from '../../types';
import { LinePlot, LineProps, getSchemeTableau10 } from '../../components';
import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19CategoricalData from '../../assets/feature-action-table/covid-19-categorical-table-1.json';

const WIDTH = 1500,
  HEIGHT = 500;

const TestCFToGaussianPage = () => {
  const chartRef = useRef(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<Record<string, TimeSeriesData>>(
    {},
  );
  const [categoricalFeatures, setCategoricalFeatures] = useState<
    CategoricalFeature[]
  >([]);

  const plot = useRef(new LinePlot()).current;
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
    const categoricalGauss: TimeSeriesData[] = generateGaussForCatFeatures(
      data,
      categoricalFeatures,
    );

    console.debug('Categorical features: ', categoricalFeatures);
    console.debug('categoricalGauss:', categoricalGauss);
    // Add the original timeseries data as the first curve
    categoricalGauss.unshift(data);

    new LinePlot()
      .setData(categoricalGauss)
      .setPlotProps({
        xLabel: 'Date',
        title: `${region}`,
        leftAxisLabel: 'Number of cases',
        rightAxisLabel: 'Rank',
      })
      .setLineProps(
        data.map((d, i) => {
          if (i === 0) {
            return {
              stroke: '#D3D3D3',
              strokeWidth: 1,
            } as LineProps;
          } else {
            return {
              stroke: getSchemeTableau10(i - 1),
              strokeWidth: 2,
              onRightAxis: true,
            } as LineProps;
          }
        }),
      )
      .setCanvas(chartRef.current)
      .plot();
  }, [region]);

  const handleSelectRegion = (event: SelectChangeEvent) => {
    const region = event.target.value;
    if (region) {
      setRegion(region);
    }
  };

  return (
    <>
      <Head>
        <title>Playground | Gaussian CTS</title>
      </Head>

      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: '100%',
          py: 8,
        }}
      >
        <Typography variant="h6">
          Show Gaussian of Categorical Timeseries
        </Typography>
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

export default TestCFToGaussianPage;
