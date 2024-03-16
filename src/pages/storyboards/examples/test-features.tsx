import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { schemeTableau10 } from "d3-scale-chromatic";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TimeseriesData } from "../../../utils/storyboards/data-processing/TimeseriesData";
import { searchPeaks } from "../../../utils/storyboards/feature/feature-search";
import { Peak } from "../../../utils/storyboards/feature/Peak";
import { sliceTimeseriesByDate } from "../../../utils/storyboards/data-processing/common";
import {
  LinePlot,
  LineProperties,
} from "../../../components/storyboards/plots/LinePlot";
import { Dot } from "../../../components/storyboards/actions/Dot";
import { covid19data } from "../../../services/covid19-data";

const WIDTH = 1500,
  HEIGHT = 500;

const FeaturesPage = () => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [locData, setLocData] = useState<Record<string, TimeseriesData[]>>({});
  const [data, setData] = useState<TimeseriesData[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");

  useEffect(() => {
    if (!chartRef.current) return;

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
    const peaks: Peak[] = searchPeaks(data, undefined, undefined, 10);

    console.log("TestFeatures: data = ", data);
    console.log("FeaturesPage: peaks = ", peaks);

    const peaksData = peaks.map((peak) =>
      sliceTimeseriesByDate(data, peak.getStart(), peak.getEnd())
    );
    peaksData.unshift(data);

    console.log("TestFeatures: peaksData = ", peaksData);

    d3.select(chartRef.current)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .append("g")
      .node();

    const plot = new LinePlot()
      .data(peaksData)
      .plotProperties({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
      })
      .lineProperties(
        peaksData.map((d, i) => {
          return {
            stroke: schemeTableau10[i],
            strokeWidth: 1.5,
          } as LineProperties;
        })
      )
      .svg(chartRef.current)
      .draw();

    peaks.forEach((peak) => {
      console.log(plot.coordinates(peak.getDate()));
      new Dot()
        .properties({ color: "#FF5349" })
        .svg(chartRef.current)
        .draw()
        .coordinate(plot.coordinates(peak.getDate()))
        .show();
    });
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
          {regions.map((d) => (
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

export default FeaturesPage;
