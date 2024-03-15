import React, { useState } from "react";
import ActionPropertiesTable from "../../../components/storyboards/tables/ActionPropertiesTable";

const TestPropertiesTable = () => {
  const [data, setData] = useState({
    id: "textbox1",
    title: "Example Text",
    message: "Lorem ipsum dolor sit amet",
    backgroundColor: "#0000FF",
    width: 100,
  });

  return (
    <div>
      <ActionPropertiesTable data={data} setData={setData} />
    </div>
  );
};

export default TestPropertiesTable;
