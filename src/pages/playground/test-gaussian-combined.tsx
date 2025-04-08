import React, { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import Head from "next/head";

import { TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { searchPeaks } from "src/utils/feature-action/feature-search";
import { LinePlot, LineProps } from "src/components/plots/LinePlot";
import {
  combinedBounds,
  gmm,
  peakSegment,
  semanticBounds,
  semanticGaussians,
} from "src/utils/data-processing/Gaussian";
import { Dot } from "src/components/actions/Dot";
import { getSchemeTableau10 } from "src/components/StoryboardColors";
import { getCovid19Data } from "src/services/TimeSeriesDataService";

const WIDTH = 1500,
  HEIGHT = 500;

const TestGaussianCombinedPage = () => {
  const chartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeSeriesPoint[]>>({});
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [categoricalFeatures, setCategoricalFeatures] = useState<any[]>([]);
  const [segment, setSegment] = useState<number>(3);
  // slider formatted value
  const valuetext = (value: number) => `${value}`;

  useEffect(() => {
    if (!chartRef.current) return;

    const fetchData = async () => {
      try {
        const data = await getCovid19Data();
        setLocData(data);
        setRegions(Object.keys(data).sort());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    if (!region || !locData[region] || !chartRef.current) return;

    const data = locData[region];

    //
    // Combined Features
    //

    // Numerical
    const gaussian = gmm(data, "", 10);
    console.log("gaussian = ", gaussian);
    const ntsGauss = gaussian.map((d, i) => {
      return d.map((d1, i1) => {
        return { date: data[i1].date, y: d1 };
      });
    });
    console.log("ntsGauss = ", ntsGauss);
    let ntsBoundGauss = semanticBounds(data, ntsGauss);
    console.log("ntsBoundGauss:", ntsBoundGauss);

    // Categorical
    // let categorialFeatures = cts();
    // Ensure categoricalFeatures is an array before passing to semanticGaussians
    const categoricalGauss = semanticGaussians(data, categoricalFeatures.length > 0 ? categoricalFeatures : [], 11);
    console.log("categoricalGauss:", categoricalGauss);
    
    // Create a default empty array with the same structure as data for boundGauss
    let boundGauss;
    if (categoricalGauss.length === 0) {
      // If no categorical features, create a default array with zeros
      boundGauss = data.map(d => ({ date: d.date, y: 0 }));
    } else {
      // Ensure categoricalGauss has the correct format before passing to semanticBounds
      // It should be an array of arrays of objects with date and y properties
      const formattedCategoricalGauss: Array<{ date: Date; y: number }[]> = categoricalGauss.map(gaussArray => {
        if (Array.isArray(gaussArray)) {
          if (gaussArray.length > 0 && typeof gaussArray[0] === 'number') {
            // If it's an array of numbers, transform it to array of objects
            return gaussArray.map((value, index) => ({
              date: data[index].date,
              y: value
            }));
          } else if (gaussArray.length > 0 && typeof gaussArray[0] === 'object' && gaussArray[0] !== null && 'date' in gaussArray[0]) {
            // If it's already an array of objects with date property, ensure y is a number
            return gaussArray.map(item => {
              // Handle case where y might be an object instead of a number
              if (typeof item.y === 'object' && item.y !== null && 'y' in item.y) {
                return { date: item.date, y: (item.y as any).y };
              }
              return { date: item.date, y: typeof item.y === 'number' ? item.y : 0 };
            });
          }
        }
        // Fallback: create a default array with the correct structure
        return data.map(d => ({ date: d.date, y: 0 }));
      });
      // Now pass the correctly formatted data to semanticBounds
      boundGauss = semanticBounds(data, formattedCategoricalGauss);
    }
    console.log("boundGauss:", boundGauss);

    // Create a properly typed array for ctsBoundGauss
    let ctsBoundGauss: Array<{ date: Date; y: number }[]> = [boundGauss];

    // Combine
    const combined = combinedBounds(data, ntsBoundGauss, boundGauss);

    // Before plotting all together
    
    // Add the original data to the beginning of the array
    ctsBoundGauss.unshift(data.map(d => ({ date: d.date, y: d.y ?? 0 })));
    
    // Add ntsBoundGauss to the array - ensure it has the correct type
    if (Array.isArray(ntsBoundGauss)) {
      if (ntsBoundGauss.length > 0 && 'date' in ntsBoundGauss[0]) {
        // ntsBoundGauss is already in the correct format
        ctsBoundGauss.push(ntsBoundGauss as { date: Date; y: number }[]);
      } else {
        // Need to transform ntsBoundGauss
        ctsBoundGauss.push(data.map((d, i) => ({
          date: d.date,
          y: Array.isArray(ntsBoundGauss) && i < ntsBoundGauss.length ? 
              (typeof ntsBoundGauss[i] === 'number' ? ntsBoundGauss[i] : 0) : 0
        })));
      }
    }
    
    // Add combined to the array
    ctsBoundGauss.push(combined.map(d => ({ date: d.date, y: d.y ?? 0 })));

    const plot = new LinePlot()
      .setData(ctsBoundGauss)
      .setPlotProps({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
        rightAxisLabel: "Rank",
      })
      .setLineProps(
        ctsBoundGauss.map((d, i) => {
          if (i === 0) {
            return {
              stroke: "#D3D3D3",
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
        })
      )
      .setCanvas(chartRef.current)
      .plot();

    //
    //
    //

    console.log("combined:", combined);

    let peaks = searchPeaks(combined, 0, '', 10);
    console.log("peaks:", peaks);
    const peaks1 = peakSegment(peaks, combined.length, false);
    // console.log("peaks1:", peaks1);

    peaks.forEach((d, i) => {
      if (!chartRef.current) return;
      
      new Dot()
        .setProps({
          size: 8,
          color: "green",
          opacity: i < segment - 1 ? 1 : 0.2,
        })
        .setCanvas(chartRef.current)
        .setCoordinate(plot.getCoordinates(d.getDate(), 3))
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

  const handleChangeSlider = (_event: React.SyntheticEvent | Event, value: number | number[]) => {
    const selectedSegment = typeof value === 'number' ? value : value[0];
    console.log("segment = ", selectedSegment);
    if (selectedSegment !== undefined && selectedSegment !== segment) {
      setSegment(selectedSegment);
    }
  };

  return (
    <>
      <Head>
        <title>Playground | Gaussian Combined</title>
      </Head>

      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <FormGroup
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
              alignItems: "center",
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
              // labelId="segment-slider"
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
              border: "1px solid",
            }}
          ></svg>
        </FormGroup>
      </Box>
    </>
  );
};

export default TestGaussianCombinedPage;
