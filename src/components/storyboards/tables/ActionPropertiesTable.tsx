import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as d3 from "d3";
import { ActionFactory } from "../actions/ActionFactory";
import { Actions } from "../actions/Actions";

const useStyles = makeStyles({
  table: {
    width: "100%",
    borderCollapse: "collapse", // remove border collapse
  },
  keyCell: {
    width: "20%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none",
  },
  valueCell: {
    width: "60%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none", // remove lines between cells
  },
  valueInput: {
    width: "100%",
    height: "100%",
    fontSize: "12px",
    padding: "2px", // adjust padding for input
    "& input": {
      border: "none", // Remove border
      outline: "none", // Remove focus outline
      padding: "1px", // adjust padding for input
    },
  },
  drawingCell: {
    width: "10%",
    padding: "2px", // reduce padding
    border: "none", // remove border
  },
});

interface ActionPropertiesTableProps {
  data: Record<string, any>;
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const ActionPropertiesTable: React.FC<ActionPropertiesTableProps> = ({
  data,
  setData,
}) => {
  // console.log("ActionPropertiesTable: re-rendered: data = ", data);
  const classes = useStyles();
  const [rows, setRows] = useState({ ...data });
  const chartRef = useRef(null);

  const actionFactory = new ActionFactory();

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows({ ...data }); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleInputChange = (key: string, value: any) => {
    const updatedData = { ...rows, [key]: value };
    setRows(updatedData);
    // console.log("ActionPropertiesTable: rows = ", rows);
    // console.log("ActionPropertiesTable: updatedData = ", updatedData);
    setData(updatedData); // update the parent component's data
  };

  const entries = Object.entries(rows).filter(
    ([key]) => key !== "id" && key !== "action"
  );
  const totalRows = entries.length;

  function drawSvgObject(data) {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const height = 100 - margin.top - margin.bottom;
    const width = 100 - margin.left - margin.right;
    d3.select(chartRef.current).select("svg").remove();
    const svg = d3.select(chartRef.current).append("svg").node();

    if (data.action == Actions.TEXT_BOX) {
      data.width = 80;
      data.title = "...";
      data.message = "...";
    }
    console.log({ ...data });
    actionFactory
      .create(data.action, data)
      ?.svg(svg)
      .draw()
      .coordinate([50, 100], [50, 50])
      // .coordinate([0, 0], [0, 0])
      .show();

    return (
      <svg
        ref={chartRef}
        style={{ width: width, height: height, border: "0px solid" }}
      ></svg>
    );
  }

  return (
    <Table className={classes.table}>
      <TableBody>
        {entries.map(([key, value], index) => (
          <TableRow key={key}>
            <TableCell className={classes.keyCell}>
              <Input
                disableUnderline
                className={classes.valueInput}
                type="text"
                value={key}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </TableCell>
            <TableCell className={classes.valueCell}>
              <Input
                disableUnderline
                className={classes.valueInput}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </TableCell>
            {index === 0 && (
              <TableCell
                className={classes.drawingCell}
                style={{ verticalAlign: "middle" }}
                rowSpan={totalRows}
              >
                {drawSvgObject(rows)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActionPropertiesTable;
