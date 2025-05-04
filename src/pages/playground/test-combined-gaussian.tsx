import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
} from '@mui/material';

// local import
import * as msb from '../..';
// import from npm library
// import * as msb from 'meta-storyboard';

import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19CategoricalFATable from '../../assets/feature-action-table/covid-19-categorical-table.json';
import covid19NumFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';

const WIDTH = 1500,
  HEIGHT = 500;

const TestCombinedGaussianPage = () => {
  const chartRef = useRef(null);
  const [segment, setSegment] = useState<number>(3);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<
    Record<string, msb.TimeSeriesData>
  >({});
  const [categoricalFeatures, setCategoricalFeatures] = useState<
    msb.CategoricalFeature[]
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
      ) as Record<string, msb.TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());
      console.log(
        `${Object.keys(casesData).length} regions' data: `,
        casesData,
      );

      // 1.2 Get categorical features
      setCategoricalFeatures(
        covid19CategoricalFATable.map((d) =>
          new msb.CategoricalFeature()
            .setDate(new Date(d.date))
            .setRank(d.rank)
            .setDescription(d.event),
        ),
      );
      // prettier-ignore
      console.debug('TestCombinedGaussianPage: categoricalFeatures: ', categoricalFeatures);

      // 1.3 Get numerical feature-action table
      setNumericalFATable(covid19NumFATable);
      // prettier-ignore
      console.debug('TestCombinedGaussianPage: numericalFATable: ', numericalFATable);

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

    const peakGauss: msb.TimeSeriesData[] = msb.generateGaussForPeaks(data);
    const catagoricalFeatureGauss: msb.TimeSeriesData[] =
      msb.generateGaussForCategoricalFeatures(data, categoricalFeatures);
    const peakGaussBounds: msb.TimeSeriesData = msb.maxAcrossSeries(
      data,
      peakGauss,
    );
    const catagoricalFeatureGaussBounds: msb.TimeSeriesData =
      msb.maxAcrossSeries(data, catagoricalFeatureGauss);

    // prettier-ignore
    console.debug('TestCombinedGaussianPage: peakGaussBounds:', peakGaussBounds);
    // prettier-ignore
    console.debug('TestCombinedGaussianPage: catagoricalFeatureGaussBounds:', catagoricalFeatureGaussBounds);

    let combinedGauss1: msb.TimeSeriesData = msb.combineSeries(data, [
      peakGaussBounds,
      catagoricalFeatureGaussBounds,
    ]);

    // prettier-ignore
    console.debug('TestCombinedGaussianPage: combinedGauss1:', combinedGauss1);

    //
    // --- Test the all-in-one GMM function ---
    // single gmm function to generate and combine Gaussian series
    //

    const combinedGauss2 = msb.gmm(data, categoricalFeatures);
    console.debug('TestCombinedGaussianPage: combinedGauss2:', combinedGauss2);

    //
    // --- Test segmentation - we have two functions implemented slightly differently ---
    //

    /*
    // Option-1: Using segmentByImportantPeaks 
    const segmentPoints1 = segmentByImportantPeaks(combined, segment, 0.15);
    // prettier-ignore
    console.debug('TestCombinedGaussianPage: Segmentation points (method 1):', segmentPoints1);

    // Find categorical features at segmentation points
    const featuresAtSegmentPoints1 = segmentPoints1.map((point) => {
      const feature = findCategoricalFeatureByDate(
        categoricalFeatures,
        point.date,
      );
      return {
        segmentIndex: point.idx,
        date: point.date,
        feature: feature ? feature.getDescription() : 'No feature found',
      };
    });
    
    // Option-2: Using segmentByImportantPeaks1 
    const segmentPoints2 = segmentByImportantPeaks1(combined, segment, 0.15);
    // prettier-ignore
    console.debug('TestCombinedGaussianPage: Segmentation points (method 2):', segmentPoints2);
    */

    // Option-3: Using segmentByPeaks
    const segmentedGaussianPeakPoints = msb.segmentByPeaks(
      combinedGauss2,
      segment,
    );
    // prettier-ignore
    console.debug('TestCombinedGaussianPage: segmentedGaussianPeakPoints:', segmentedGaussianPeakPoints);

    // Find categorical features at segmentation points
    const catFeaturesAtSegments = segmentedGaussianPeakPoints.map((point) => {
      let catFeature = msb.findClosestCategoricalFeature(
        categoricalFeatures,
        point.date,
      );

      let numFeature = msb.findClosestNumericalFeature(
        msb.searchPeaks(data, 0, ''),
        point.date,
      );

      let closestFeature = msb.findClosestFeature(
        categoricalFeatures,
        msb.searchPeaks(data, 0, ''),
        point.date,
      );

      // prettier-ignore
      console.debug('TestCombinedGaussianPage: matches at date:', point.date, '\ncatFeature:', catFeature, '\nnumFeature:', numFeature, '\nclosestFeature:', closestFeature);
    });

    // prettier-ignore
    console.debug('TestCombinedGaussianPage: catFeaturesAtSegments:', catFeaturesAtSegments);

    const numFeaturesAtSegments = segmentedGaussianPeakPoints.map((point) => {
      return {
        segmentIndex: point.idx,
        date: point.date,
      };
    });
    // prettier-ignore
    console.debug('TestCombinedGaussianPage: numFeaturesAtSegments:', numFeaturesAtSegments);

    //
    // --- Draw everything ---
    //

    // show original timeseries, gaussians, and combined
    const plot = new msb.LinePlot()
      .setData([
        data,
        peakGaussBounds,
        catagoricalFeatureGaussBounds,
        combinedGauss1,
      ])
      .setPlotProps({
        xLabel: 'Date',
        title: `${region}`,
        leftAxisLabel: 'Number of cases',
        rightAxisLabel: 'Rank',
      } as any)
      .setLineProps(
        combinedGauss1.map((d, i) => {
          if (i === 0) {
            return {
              stroke: '#D3D3D3',
              strokeWidth: 2,
              showPoints: false,
            } as any;
          } else {
            return {
              stroke: msb.getSchemeTableau10(i - 1),
              strokeWidth: 2,
              onRightAxis: true,
              showPoints: false,
            } as any;
          }
        }),
      )
      .setCanvas(chartRef.current)
      .plot();

    // show peaks for debugging purpose
    const peaks: msb.Peak[] = msb.searchPeaks(data);
    peaks.forEach((d: msb.Peak, i: number) => {
      if (!chartRef.current) return;

      new msb.Dot()
        .setProps({
          size: 4,
          color: 'blue',
          opacity: 0.5,
        } as any)
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(d.getDate(), 3))
        .show();
    });

    // Visualize segmentation points from method 1
    segmentedGaussianPeakPoints.forEach((point) => {
      if (!chartRef.current) return;
      new msb.Circle()
        .setProps({
          size: 8,
          color: 'blue',
          opacity: 1,
        } as any)
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(point.date, 3))
        .show();

      // If there's a categorical feature at this point, add a label or different visualization
      const feature = msb.findCategoricalFeatureByDate(
        categoricalFeatures,
        point.date,
      );
      if (feature) {
        new msb.Circle()
          .setProps({
            size: 12,
            color: 'green',
            opacity: 1,
          } as any)
          .setCanvas(chartRef.current)
          .setCoordinate(plot.getCoordinates(point.date, 3))
          .show();
      }
    });

    /*
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
      const feature = findCategoricalFeatureByDate(
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
    */

    return () => {};
  }, [region, segment]);

  const handleSelectRegion = (event: any) => {
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
