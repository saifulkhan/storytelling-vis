import React, { useState } from "react";
import ActionPropertiesTable from "../../../components/storyboards/tables/ActionPropertiesTable";

const TestActionPropertiesTablePage = () => {
  const [data, setData] = useState({
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

export default TestActionPropertiesTablePage;
