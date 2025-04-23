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
  searchPeaks,
  segmentByImportantPeaks1,
  combineSeries,
  segmentByImportantPeaks,
  maxAcrossSeries,
  generateGaussForCatFeatures,
  gmm,
  Peak,
  findCategoricalFeatureByDate,
  findClosestCategoricalFeature,
} from '../../utils';
import {
  Circle,
  Dot,
  getSchemeTableau10,
  LinePlot,
  LineProps,
} from '../../components';

import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19CategoricalFATable from '../../assets/feature-action-table/covid-19-categorical-table-1.json';
import covid19NumFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';

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
  const [numericalFATable, setNumericalFATable] = useState<any>(null);

  // slider formatted value
  const valuetext = (value: number) => `${value}`;

  useEffect(() => {
    if (!chartRef.current) return;

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
      ) as Record<string, TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());
      console.log(
        `${Object.keys(casesData).length} regions' data: `,
        casesData,
      );

      // 1.2 Get categorical features
      setCategoricalFeatures(
        covid19CategoricalFATable.map((d) =>
          new CategoricalFeature()
            .setDate(new Date(d.date))
            .setRank(d.rank)
            .setDescription(d.event),
        ),
      );
      console.log('Categorical features: ', categoricalFeatures);

      // 1.3 Get numerical feature-action table
      setNumericalFATable(covid19NumFATable);
      console.log('Numerical feature-action table: ', numericalFATable);

      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;

    const data = casesData[region];

    //
    // --- Test individual Gaussian generation functions ---
    //

    // Generate Gaussian time series for numerical peaks
    const ntsGauss: TimeSeriesData[] = generateGaussForPeaks(data);
    // Generate Gaussian time series for categorical features
    const ctsGauss: TimeSeriesData[] = generateGaussForCatFeatures(
      data,
      categoricalFeatures,
    );
    // Compute the maximum value across all numerical and categorical Gaussian series
    const ntsBoundGauss: TimeSeriesData = maxAcrossSeries(data, ntsGauss);
    const ctsBoundGauss: TimeSeriesData = maxAcrossSeries(data, ctsGauss);
    console.log('ntsBoundGauss:', ntsBoundGauss);
    console.log('ctsBoundGauss:', ctsBoundGauss);
    // Combine the bounded Gaussian series into a single time series
    let combined = combineSeries(data, [ntsBoundGauss, ctsBoundGauss]);
    console.log('combined:', combined);

    //
    // --- Test the all-in-one GMM function ---
    //

    // Use the gmm function to generate and combine Gaussian series in one step
    combined = gmm(data, categoricalFeatures);
    console.log('combined:', combined);

    //
    // --- Test segmentation - we have two functions implemented slightly differently ---
    //

    // Option-1: Using segmentByImportantPeaks with k=4 segments
    const segmentPoints1 = segmentByImportantPeaks(combined, segment, 0.15);
    console.log('Segmentation points (method 1):', segmentPoints1);

    // Option-2: Using segmentByImportantPeaks1 with user-defined segment count
    const segmentPoints2 = segmentByImportantPeaks1(combined, segment, 0.15);
    console.log('Segmentation points (method 2):', segmentPoints2);

    // Find categorical features at segmentation points
    const featuresAtSegmentPoints1 = segmentPoints1.map((point) => {
      const feature = findClosestCategoricalFeature(
        categoricalFeatures,
        point.date,
      );
      return {
        segmentIndex: point.idx,
        date: point.date,
        feature: feature ? feature.getDescription() : 'No feature found',
      };
    });
    console.log(
      'Categorical features at segmentation points (method 1):',
      featuresAtSegmentPoints1,
    );

    const featuresAtSegmentPoints2 = segmentPoints2.map((point) => {
      const feature = findClosestCategoricalFeature(
        categoricalFeatures,
        point.date,
      );
      return {
        segmentIndex: point.idx,
        date: point.date,
        feature: feature ? feature.getDescription() : 'No feature found',
      };
    });
    console.log(
      'Categorical features at segmentation points (method 2):',
      featuresAtSegmentPoints2,
    );

    //
    // --- Draw everything ---
    //

    // show original timeseries, gaussians, and combined
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

    // show peaks for debugging purpose
    const peaks: Peak[] = searchPeaks(data);
    peaks.forEach((d: Peak, i: number) => {
      if (!chartRef.current) return;

      new Dot()
        .setProps({
          size: 4,
          color: 'blue',
          opacity: 0.5,
        })
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(d.getDate(), 3))
        .show();
    });

    // Visualize segmentation points from method 1
    segmentPoints1.forEach((point) => {
      if (!chartRef.current) return;
      new Circle()
        .setProps({
          size: 8,
          color: 'blue',
          opacity: 1,
        })
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(point.date, 3))
        .show();

      // If there's a categorical feature at this point, add a label or different visualization
      const feature = findClosestCategoricalFeature(
        categoricalFeatures,
        point.date,
      );
      if (feature) {
        new Circle()
          .setProps({
            size: 12,
            color: 'green',
            opacity: 1,
          })
          .setCanvas(chartRef.current)
          .setCoordinate(plot.getCoordinates(point.date, 3))
          .show();
      }
    });

    // Visualize segmentation points from method 2
    segmentPoints2.forEach((point) => {
      if (!chartRef.current) return;

      new Circle()
        .setProps({
          size: 16,
          color: 'red',
          opacity: 1,
        })
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(point.date, 3))
        .show();

      // If there's a categorical feature at this point, add a label or different visualization
      const feature = findClosestCategoricalFeature(
        categoricalFeatures,
        point.date,
      );
      if (feature) {
        new Circle()
          .setProps({
            size: 20,
            color: 'orange',
            opacity: 1,
          })
          .setCanvas(chartRef.current)
          .setCoordinate(plot.getCoordinates(point.date, 3))
          .show();
      }
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
