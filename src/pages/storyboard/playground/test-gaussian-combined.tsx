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

import { TimeSeriesPoint } from "../../../utils/data-processing/TimeSeriesPoint";
import { searchPeaks } from "../../../utils/feature-action/feature-search";
import {
  LinePlot,
  LineProps,
} from "../../../components/storyboard/plots/LinePlot";
import {
  combinedBounds,
  gmm,
  peakSegment,
  semanticBounds,
  semanticGaussians,
} from "../../../utils/data-processing/Gaussian";
import { Dot } from "../../../components/storyboard/actions/Dot";
import { getSchemeTableau10 } from "../../../components/storyboard/StoryboardColors";
import { getCovid19Data } from "../../../services/TimeSeriesDataService";

const WIDTH = 1500,
  HEIGHT = 500;

const TestGaussianCombinedPage = () => {
  const chartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeSeriesPoint[]>>({});
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [categoricalFeatures, setCategoricalFeatures] = useState<string>([]);
  const [segment, setSegment] = useState<number>(3);
  // slider formatted value
  const valuetext = (value) => `${value}`;

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
    const categoricalGauss = semanticGaussians(data, categoricalFeatures, 11);
    console.log("categoricalGauss:", categoricalGauss);
    let boundGauss = semanticBounds(data, categoricalGauss);
    console.log("boundGauss:", boundGauss);

    let ctsBoundGauss = [boundGauss];

    // Combine
    const combined = combinedBounds(data, ntsBoundGauss, boundGauss);

    // Before plotting all together

    ctsBoundGauss.unshift(data);
    ctsBoundGauss.push(ntsBoundGauss);
    ctsBoundGauss.push(combined);

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

    let peaks = searchPeaks(combined, undefined, undefined, 10);
    console.log("peaks:", peaks);
    const peaks1 = peakSegment(peaks, combinedBounds.length, false);
    // console.log("peaks1:", peaks1);

    peaks.forEach((d, i) => {
      new Dot()
        .setProps({
          strokeWidth: 3,
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

  const handleChangeSlider = (event) => {
    const selectedSegment = event.target.value;
    console.log("segment = ", selectedSegment);
    if (selectedSegment && selectedSegment !== segment) {
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
