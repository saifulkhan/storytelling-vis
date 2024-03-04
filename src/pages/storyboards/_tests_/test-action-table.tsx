import React, { useState } from "react";
import { ActionTableRowType } from "../../../components/storyboards/tables/FeatureActionTableRowType";
import { ActionEnum } from "../../../components/storyboards/actions/ActionEnum";
import ActionTable from "../../../components/storyboards/tables/ActionTable";

const mockData: ActionTableRowType[] = [
  {
    action: ActionEnum.DOT,
    properties: {
      id: "Dot",
      size: 5,
      color: "#FF0000",
      opacity: 0.7,
    },
  },
  {
    action: ActionEnum.CIRCLE,
    properties: {
      id: "Circle",
      size: 10,
      strokeWidth: 2,
      color: "#00FF00",
      opacity: 0.5,
    },
  },
  {
    action: ActionEnum.TEXT_BOX,
    properties: {
      id: "TextBox",
      title: "Example Text",
      message: "Lorem ipsum dolor sit amet",
      backgroundColor: "#0000FF",
      width: 100,
    },
  },
  {
    action: ActionEnum.CONNECTOR,
    properties: {
      id: "Connector",
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
