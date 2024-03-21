import React, { useEffect, useState } from "react";

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
    <div>
      <FeatureActionTable data={data} setData={setData} />
    </div>
  );
};

export default FeatureActionTablesPage;
