import React, { useState } from "react";
import FeatureActionTable from "../../../components/storyboards/tables/FeatureActionTable";
import { featureActionTableStory1 } from "../../../mocks/feature-action-table-covid19";
import { multiVariateStory } from "../../../mocks/feature-action-table-ml";

const TestFeatureActionTable = () => {
  const [data, setData] = useState(multiVariateStory);

  return (
    <div>
      <FeatureActionTable data={data} setData={setData} />
    </div>
  );
};

export default TestFeatureActionTable;
