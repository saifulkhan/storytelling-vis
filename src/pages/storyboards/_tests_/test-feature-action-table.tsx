import React, { useState } from "react";
import FeatureActionTable from "../../../components/storyboards/tables/FeatureActionTable";
import { featureActionTable1 } from "../../../mocks/covid19-feature-action";

const TestFeatureActionTable = () => {
  const [data, setData] = useState(featureActionTable1);

  return (
    <div>
      <FeatureActionTable data={data} setData={setData} />
    </div>
  );
};

export default TestFeatureActionTable;
