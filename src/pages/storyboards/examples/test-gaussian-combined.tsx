import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  schemeTableau10,
  schemeCategory10,
  interpolateBuGn,
} from "d3-scale-chromatic";
import {
  Box,
  Divider,
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

import { covid19data } from "../../../services/covid19-data";
import { TimeseriesData } from "../../../utils/storyboards/data-processing/TimeseriesData";
import { searchPeaks } from "../../../utils/storyboards/feature/feature-search";
import { Peak } from "../../../utils/storyboards/feature/Peak";
import { sliceTimeseriesByDate } from "../../../utils/storyboards/data-processing/common";
import {
  LinePlot,
  LineProperties,
} from "../../../components/storyboards/plots/LinePlot";
import {
  combinedBounds,
  gmm,
  peakSegment,
  semanticBounds,
  semanticGaussians,
  smoothing,
} from "../../../utils/storyboards/data-processing/gaussian";
import { categoricalTable } from "./cts";
import { Dot } from "../../../components/storyboards/actions/Dot";
import { Circle } from "../../../components/storyboards/actions/Circle";

const WIDTH = 1500,
  HEIGHT = 500;

const TestGaussianCombinedPage = () => {
  const chartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeseriesData[]>>({});
  const [data, setData] = useState<TimeseriesData[]>([]);
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
        const data = await covid19data();
        setLocData(data);
        setRegions(Object.keys(data).sort());

        const fetures = await categoricalTable();
        setCategoricalFeatures(fetures);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    if (!region || !data) return;

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
      .plotProperties({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
        rightAxisLabel: "Rank",
      })
      .lineProperties(
        ctsBoundGauss.map((d, i) => {
          if (i === 0) {
            return {
              stroke: "#D3D3D3",
              strokeWidth: 2,
              showPoints: false,
            } as LineProperties;
          } else {
            return {
              stroke: schemeCategory10[i - 1],
              strokeWidth: 2,
              onRightAxis: true,
              showPoints: false,
            } as LineProperties;
          }
        })
      )
      .setSvg(chartRef.current)
      .draw();

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
        .setProps({ color: i < segment - 1 ? "LightCoral" : "grey" })
        .setCanvas(chartRef.current)
        .draw()
        .setCoordinate(plot.getCoordinates(d.getDate(), 3))
        .show();
    });

    return () => {};
  }, [region, segment]);

  const handleSelectRegion = (event: SelectChangeEvent) => {
    const region = event.target.value;
    if (region) {
      setRegion(region);
      setData(locData[region]);
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
        <title>Test Gaussian Combined</title>
      </Head>

      <Box
        sx={{
          backgroundColor: "background.default",
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
