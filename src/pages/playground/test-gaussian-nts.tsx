import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { schemeCategory10 } from "d3-scale-chromatic";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Head from "next/head";

import { TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { LinePlot, LineProps } from "src/components/plots/LinePlot";
import { gmm, smoothing } from "src/utils/data-processing/Gaussian";
import { getCovid19Data } from "src/services/TimeSeriesDataService";

const WIDTH = 1500,
  HEIGHT = 500;

const ExampleGaussianPage = () => {
  const ntsChartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeSeriesPoint[]>>({});
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");

  useEffect(() => {
    if (!ntsChartRef.current) return;

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
    if (!region || !locData[region] || !ntsChartRef.current) return;

    const data = locData[region];

    //
    // Numerical Features
    //
    smoothing(data);

    const gaussian = gmm(data, "", 10);
    console.log("gaussian = ", gaussian);
    const gaussTS = gaussian.map((d, i) => {
      return d.map((d1, i1) => {
        return { date: data[i1].date, y: d1 || 0 };
      });
    });
    console.log("gaussTS = ", gaussTS);

    // const peaksData = peaks.map((peak) =>
    //   sliceTimeseriesByDate(data, peak.getStart(), peak.getEnd())
    // );
    gaussTS.unshift(data.map((d) => ({ date: d.date, y: 0 })));

    // console.log("TestFeatures: peaksData = ", peaksData);

    d3.select(ntsChartRef.current)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .append("g")
      .node();

    const plot = new LinePlot()
      .setData(gaussTS)
      .setPlotProps({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
        rightAxisLabel: "Ranks",
      })
      .setLineProps(
        gaussTS.map((d, i) => {
          if (i === 0) {
            return {
              stroke: "#D3D3D3",
              strokeWidth: 1,
            } as LineProps;
          } else {
            return {
              stroke: schemeCategory10[i - 1],
              strokeWidth: 2,
              onRightAxis: true,
            } as LineProps;
          }
        })
      )
      .setCanvas(ntsChartRef.current)
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
        <title>Playground | Gaussian NTS</title>
      </Head>

      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Typography variant="h6">
          Show Gaussian of Numerical Timeseries
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
            ref={ntsChartRef}
            style={{
              width: `${WIDTH}px`,
              height: `${HEIGHT}px`,
              border: "1px solid",
            }}
          ></svg>
        </FormControl>
      </Box>
    </>
  );
};

export default ExampleGaussianPage;
