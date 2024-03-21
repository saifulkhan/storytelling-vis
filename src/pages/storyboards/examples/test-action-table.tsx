import React, { useState } from "react";
import { ActionTableRow } from "../../../components/storyboards/tables/FeatureActionTableRow";
import { ActionType } from "../../../components/storyboards/actions/ActionType";
import ActionTable from "../../../components/storyboards/tables/ActionTable";

const mockData: ActionTableRow[] = [
  {
    action: ActionType.DOT,
    properties: {
      size: 5,
      color: "#FF0000",
      opacity: 0.7,
    },
  },
  {
    action: ActionType.CIRCLE,
    properties: {
      size: 10,
      strokeWidth: 2,
      color: "#00FF00",
      opacity: 0.5,
    },
  },
  {
    action: ActionType.TEXT_BOX,
    properties: {
      title: "Example Text",
      message: "Lorem ipsum dolor sit amet",
      backgroundColor: "#0000FF",
      width: 100,
    },
  },
  {
    action: ActionType.CONNECTOR,
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
