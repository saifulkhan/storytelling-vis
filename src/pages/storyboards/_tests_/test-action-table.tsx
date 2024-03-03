import React, { useState } from "react";
import { ActionEnum } from "src/components/storyboards/actions/ActionEnum";
import ActionTable from "src/components/storyboards/tables/ActionTable";
import { ActionTableRowType } from "src/components/storyboards/tables/FeatureActionTableRowType";

const mockData: ActionTableRowType[] = [
  {
    action: ActionEnum.DOT,
    properties: {
      id: "dot1",
      size: 5,
      color: "#FF0000",
      opacity: 0.7,
    },
  },
  {
    action: ActionEnum.CIRCLE,
    properties: {
      id: "circle1",
      size: 10,
      strokeWidth: 2,
      color: "#00FF00",
      opacity: 0.5,
    },
  },
  {
    action: ActionEnum.TEXT_BOX,
    properties: {
      id: "textbox1",
      title: "Example Text",
      message: "Lorem ipsum dolor sit amet",
      backgroundColor: "#0000FF",
      width: 100,
    },
  },
  {
    action: ActionEnum.CONNECTOR,
    properties: {
      id: "connector1",
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
