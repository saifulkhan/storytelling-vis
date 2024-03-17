import React, { useEffect, useState } from "react";

import FeatureActionTable from "../../components/storyboards/tables/FeatureActionTable";
import { FeatureActionTableRow } from "../../components/storyboards/tables/FeatureActionTableRow";
import { covid19NumericalTable1 } from "../../services/data";

const FeatureActionTablesPage = () => {
  const [data, setData] = useState<FeatureActionTableRow[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const table =
          (await covid19NumericalTable1()) as FeatureActionTableRow[];
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
