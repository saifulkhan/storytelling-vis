import React, { useState } from "react";
import PropertiesTable from "../../../components/storyboards/tables/PropertiesTable";

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
      <PropertiesTable data={data} setData={setData} />
    </div>
  );
};

export default TestPropertiesTable;
