import React, { useState } from "react";
import FeatureActionTable from "../../../components/storyboards/tables/FeatureActionTable";
import { ML_STORY_1 } from "../../../mocks/feature-action-table-ml";

const TestFeatureActionTable = () => {
  const [data, setData] = useState(ML_STORY_1);

  return (
    <div>
      <FeatureActionTable data={data} setData={setData} />
    </div>
  );
};

export default TestFeatureActionTable;
