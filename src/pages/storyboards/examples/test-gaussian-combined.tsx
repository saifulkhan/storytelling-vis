import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  schemeTableau10,
  schemeCategory10,
  interpolateBuGn,
} from "d3-scale-chromatic";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
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

const WIDTH = 1500,
  HEIGHT = 500;

const ExampleGaussianPage = () => {
  const chartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeseriesData[]>>({});
  const [data, setData] = useState<TimeseriesData[]>(undefined);
  const [regions, setRegions] = useState<string[]>(undefined);
  const [region, setRegion] = useState<string>(undefined);
  const [categorialFeatures, setCategoricalFeatures] =
    useState<string>(undefined);

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
    const categoricalGauss = semanticGaussians(data, categorialFeatures, 11);
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
      .data(ctsBoundGauss)
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
              strokeWidth: 1,
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
      .svg(chartRef.current)
      .draw();

    //
    //
    //

    console.log("combined:", combined);

    let peaks = searchPeaks(combined, undefined, undefined, undefined);
    console.log("peaks:", peaks);
    peaks = peakSegment(peaks, combinedBounds.length, false);
    console.log("peaks:", peaks);

    peaks.forEach((d, i) => {
      new Dot()
        .properties({ color: "#FF5349" })
        .svg(chartRef.current)
        .draw()
        .coordinate(plot.coordinates(d.getDate()))
        .show();
    });

    return () => {};
  }, []);

  const handleSelectRegion = (event: SelectChangeEvent) => {
    const region = event.target.value;
    if (region) {
      setRegion(region);
      setData(locData[region]);
    }
  };

  return (
    <>
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
            border: "1px solid",
          }}
        ></svg>
      </FormControl>
    </>
  );
};

export default ExampleGaussianPage;
