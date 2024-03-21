import React, { useEffect, useRef, useState } from "react";
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

import { TimeseriesData } from "../../../utils/storyboards/data-processing/TimeseriesData";
import {
  LinePlot,
  LineProps,
} from "../../../components/storyboards/plots/LinePlot";
import { semanticGaussians } from "../../../utils/storyboards/data-processing/Gaussian";
import { getSchemeTableau10 } from "../../../components/storyboards/StoryboardColors";
import {
  getCovid19SLCFATable,
  getCovid19Data,
} from "../../../services/DataService";

const WIDTH = 1500,
  HEIGHT = 500;

const ExampleGaussianPage = () => {
  const ctsChartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeseriesData[]>>({});
  const [regions, setRegions] = useState<string[]>(undefined);
  const [region, setRegion] = useState<string>(undefined);

  const [categorialFeatures, setCategoricalFeatures] =
    useState<string>(undefined);

  useEffect(() => {
    if (!ctsChartRef.current) return;

    const fetchData = async () => {
      try {
        const data = await getCovid19Data();
        setLocData(data);
        setRegions(Object.keys(data).sort());

        const fetures = await getCovid19SLCFATable();
        setCategoricalFeatures(fetures);
        setRegion("Aberdeenshire");
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    if (!region || !locData[region] || !ctsChartRef.current) return;

    const data = locData[region];

    //
    // Categorical Features
    //

    // let categorialFeatures = cts();
    const categoricalGauss = semanticGaussians(data, categorialFeatures, 11);
    console.log("categoricalGauss:", categoricalGauss);
    categoricalGauss.unshift(data);

    new LinePlot()
      .setData(categoricalGauss)
      .setPlotProps({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
        rightAxisLabel: "Rank",
      })
      .setLineProps(
        categoricalGauss.map((d, i) => {
          if (i === 0) {
            return {
              stroke: "#D3D3D3",
              strokeWidth: 1,
            } as LineProps;
          } else {
            return {
              stroke: getSchemeTableau10(i - 1),
              strokeWidth: 2,
              onRightAxis: true,
            } as LineProps;
          }
        })
      )
      .setCanvas(ctsChartRef.current)
      .plot();

    //
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
        <title>Test Gaussian of Categorical Timeseries</title>
      </Head>

      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100%",
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
            ref={ctsChartRef}
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
