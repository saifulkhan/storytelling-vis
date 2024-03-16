import React, { useEffect, useState } from "react";
import FeatureActionTable from "../../components/storyboards/tables/FeatureActionTable";
import { readJSON } from "../../services/data";
import { FeatureActionTableRow } from "../../components/storyboards/tables/FeatureActionTableRow";

const TABLE = "/static/storyboards/feature-action-tables/covid-19-story-1.json";

const TestFeatureActionTable = () => {
  const [data, setData] = useState<FeatureActionTableRow[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const table = (await readJSON(TABLE)) as FeatureActionTableRow[];
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

export default TestFeatureActionTable;
