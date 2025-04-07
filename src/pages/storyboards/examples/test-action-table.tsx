import React, { useState } from "react";
import { ActionTableRow } from "../../../components/storyboard/tables/FeatureActionTableRow";
import { MSBActionName } from "../../../components/storyboard/actions/MSBActionName";
import ActionTable from "../../../components/storyboard/tables/ActionTable";

const mockData: ActionTableRow[] = [
  {
    action: MSBActionName.DOT,
    properties: {
      size: 5,
      color: "#FF0000",
      opacity: 0.7,
    },
  },
  {
    action: MSBActionName.CIRCLE,
    properties: {
      size: 10,
      strokeWidth: 2,
      color: "#00FF00",
      opacity: 0.5,
    },
  },
  {
    action: MSBActionName.TEXT_BOX,
    properties: {
      title: "Example Text",
      message: "Lorem ipsum dolor sit amet",
      backgroundColor: "#0000FF",
      width: 100,
    },
  },
  {
    action: MSBActionName.CONNECTOR,
    properties: {
      stroke: "#FFFF00",
      opacity: 0.8,
    },
  },
];

const TestActionTable = () => {
  const [data, setData] = useState(mockData);

  return (
    <div>
      <ActionTable data={data} setData={setData} />
    </div>
  );
};

export default TestActionTable;
