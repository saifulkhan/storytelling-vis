import React, { useState } from "react";

import { featureActionTable1 } from "src/mock/covid19-feature-action";
import { ActionEnum } from "src/components/storyboards/actions/ActionEnum";
import { DotProperties } from "src/components/storyboards/actions/Dot";
import DynamicNestedTable from "src/components/storyboards/tables/DataGridTable";
import ActionTable from "src/components/storyboards/tables/ActionTable";
import KeyValueTable from "src/components/storyboards/tables/KeyValueTable";

const FeatureActionPage = () => {
  // Define state to manage the table rows
  const [tableRows, setTableRows] = useState(featureActionTable1); // Initialize with an empty array or with initial data

  // Define a function to handle changes to the table rows
  const handleTableChange = (updatedRows: any[]) => {
    setTableRows(updatedRows);
  };

  const initialRows = [
    {
      id: "1",
      action: ActionEnum.DOT,
      properties: { size: 10, color: "#ab2345" } as DotProperties,
    },
    // Add more initial rows if needed
  ];

  const [keyValueData, setKeyValueData] = useState({
    color: "#abcd",
    stroke: 2,
    opacity: 0.1,
    message:
      "In this modified version, each value is displayed within an input field. The handleInputChange function updates the editedData state whenever a value in an input field is changed. Finally, you can handle the edited data according to your application logic. For instance, in the example, I've included a   button to log the edited data to the console.",
  });

  return (
    <div>
      <ActionTable />

      <div>
        {/* <KeyValueTable data={keyValueData} />
        <button onClick={() => console.log(keyValueData)}>Save</button> */}
      </div>
    </div>
  );
};

export default FeatureActionPage;
