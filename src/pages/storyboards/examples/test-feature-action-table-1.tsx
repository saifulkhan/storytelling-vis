import React, { useState } from "react";
import FeatureActionTable from "../../../components/storyboards/tables/FeatureActionTable";
import { COVID19_STORY_1 } from "../../../mocks/feature-action-table-covid19";

const TestFeatureActionTable = () => {
  const [data, setData] = useState(COVID19_STORY_1);

  return (
    <div>
      <FeatureActionTable data={data} setData={setData} />
    </div>
  );
};

export default TestFeatureActionTable;
