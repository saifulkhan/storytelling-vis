import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { schemeTableau10, schemeCategory10 } from "d3-scale-chromatic";
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
  gmm,
  semanticGaussians,
  smoothing,
} from "../../../utils/storyboards/data-processing/gaussian";
import { CategoricalFeature } from "../../../utils/storyboards/feature/CategoricalFeature";
import { CategoricalFeatures } from "../../../utils/storyboards/feature/CategoricalFeatures";

const WIDTH = 1500,
  HEIGHT = 500;

const ExampleGaussianPage = () => {
  const ntsChartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeseriesData[]>>({});
  const [data, setData] = useState<TimeseriesData[]>(undefined);
  const [regions, setRegions] = useState<string[]>(undefined);
  const [region, setRegion] = useState<string>(undefined);

  useEffect(() => {
    if (!ntsChartRef.current) return;

    const fetchData = async () => {
      try {
        const data = await covid19data();
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
    if (!region || !data) return;

    //
    // Numerical Features
    //
    smoothing(data);

    const gaussian = gmm(data, "", 10);
    console.log("gaussian = ", gaussian);
    const gaussTS = gaussian.map((d, i) => {
      return d.map((d1, i1) => {
        return { date: data[i1].date, y: d1 };
      });
    });
    console.log("gaussTS = ", gaussTS);

    // const peaksData = peaks.map((peak) =>
    //   sliceTimeseriesByDate(data, peak.getStart(), peak.getEnd())
    // );
    gaussTS.unshift(data);

    // console.log("TestFeatures: peaksData = ", peaksData);

    d3.select(ntsChartRef.current)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .append("g")
      .node();

    const plot = new LinePlot()
      .data(gaussTS)
      .plotProperties({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
      })
      .lineProperties(
        gaussTS.map((d, i) => {
          if (i === 0) {
            return {
              stroke: "#D3D3D3",
              strokeWidth: 1,
            } as LineProperties;
          } else {
            return {
              stroke: schemeCategory10[i - 1],
              strokeWidth: 2,
              onRightAxis: true,
            } as LineProperties;
          }
        })
      )
      .svg(ntsChartRef.current)
      .draw();
  }, [data]);

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
          ref={ntsChartRef}
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