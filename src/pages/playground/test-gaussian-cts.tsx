import { useEffect, useRef, useState } from "react";
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

import { TimeSeriesData, TimeSeriesPoint } from "src/types/TimeSeriesPoint";
import { LinePlot, LineProps } from "src/components/plots/LinePlot";
import { semanticGaussians } from "src/utils/data-processing/Gaussian";
import { getSchemeTableau10 } from "src/components/Colors";
import { getCovid19Data } from "src/services/TimeSeriesDataService";
import { CategoricalFeature } from "src/utils/feature-action/CategoricalFeature";

const WIDTH = 1500,
  HEIGHT = 500;

const ExampleGaussianPage = () => {
  const ctsChartRef = useRef(null);
  const [locData, setLocData] = useState<Record<string, TimeSeriesData>>({});
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [categoricalFeatures, setCategoricalFeatures] = useState<CategoricalFeature[]>([]);

  useEffect(() => {
    if (!ctsChartRef.current) return;

    const fetchData = async () => {
      try {
        const data = await getCovid19Data();
        setLocData(data);
        setRegions(Object.keys(data).sort());

        // We'll set up proper categorical features later
        // For now, we're just initializing with an empty array
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

    // Create a safe default if categoricalFeatures is empty
    // semanticGaussians returns an array that needs to be properly typed
    const rawGaussians = categoricalFeatures.length > 0 
      ? semanticGaussians(data, categoricalFeatures, 11)
      : [];
      
    // Explicitly convert the result to ensure type safety
    const categoricalGauss: TimeSeriesData[] = [];
    console.log("categoricalGauss:", categoricalGauss);
    
    // Create a properly typed array for the plot data
    // Need to ensure proper type conversion
    const plotData: TimeSeriesData[] = [];
    
    // Add each item from rawGaussians with proper type checking
    if (rawGaussians.length > 0) {
      rawGaussians.forEach(gauss => {
        if (Array.isArray(gauss) && gauss.length > 0) {
          if (gauss[0] && typeof gauss[0] === 'object' && 'date' in gauss[0] && 'y' in gauss[0]) {
            // It's already in the correct format - use unknown as intermediate step
            categoricalGauss.push(gauss as unknown as TimeSeriesData);
            plotData.push(gauss as unknown as TimeSeriesData);
          } else {
            // Convert number[] to TimeSeriesData
            const convertedGauss = gauss.map((value, index) => ({
              date: data[index].date,
              y: typeof value === 'number' ? value : 0
            }));
            categoricalGauss.push(convertedGauss);
            plotData.push(convertedGauss);
          }
        }
      });
    }
    // Add the original data at the beginning
    plotData.unshift(data.map(d => ({ date: d.date, y: d.y ?? 0 })));

    new LinePlot()
      .setData(plotData)
      .setPlotProps({
        xLabel: "Date",
        title: `${region}`,
        leftAxisLabel: "Number of cases",
        rightAxisLabel: "Rank",
      })
      .setLineProps(
        plotData.map((d, i) => {
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
        <title>Playground | Gaussian CTS</title>
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
