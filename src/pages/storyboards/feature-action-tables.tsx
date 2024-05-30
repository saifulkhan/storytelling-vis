import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import FeatureActionTable from "../../components/storyboards/tables/FeatureActionTable";
import { FeatureActionTableRow } from "../../components/storyboards/tables/FeatureActionTableRow";
import { getCovid19SLNFATable } from "../../services/DataService";

const FeatureActionTablesPage = () => {
  const [data, setData] = useState<FeatureActionTableRow[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const table = (await getCovid19SLNFATable()) as FeatureActionTableRow[];
        console.log("table: ", table);
        setData(table);
      } catch (e) {
        console.error("Failed to fetch data:", e);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <Head>
        <title>Feature Action Table</title>
      </Head>
      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <FeatureActionTable data={data} setData={setData} />
      </Box>
    </>
  );
};

FeatureActionTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FeatureActionTablesPage;
