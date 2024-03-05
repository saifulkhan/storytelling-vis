import React, { useState } from "react";
import FeatureActionTable from "../../../components/storyboards/tables/FeatureActionTable";
import { featureActionTableStory1 } from "../../../mocks/covid19-feature-action-table";

const TestFeatureActionTable = () => {
  const [data, setData] = useState(featureActionTableStory1);

  return (
    <div>
      <FeatureActionTable data={data} setData={setData} />
    </div>
  );
};

export default TestFeatureActionTable;
