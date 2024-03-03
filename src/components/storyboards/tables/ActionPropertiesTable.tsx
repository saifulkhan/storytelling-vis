import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";

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
    width: "80%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
    borderBottom: "none", // remove lines between cells
  },
  valueInput: {
    width: "100%",
    height: "100%",
    fontSize: "12px",
    border: "none", // remove border
    padding: "2px", // adjust padding for input
    boxSizing: "border-box", // include padding and border in width and height
  },
});

const ActionPropertiesTable = ({ data, setData }) => {
  console.log("ActionPropertiesTable: re-rendered: data = ", data);

  const classes = useStyles();
  const [rows, setRows] = useState({ ...data });

  const handleInputChange = (key, value) => {
    const updatedData = { ...rows, [key]: value };
    setRows(updatedData);
    // console.log("ActionPropertiesTable: rows = ", rows);
    // console.log("ActionPropertiesTable: updatedData = ", updatedData);
    setData(updatedData); // update the parent component's data
  };

  return (
    <Table className={classes.table}>
      <TableBody>
        {Object.entries(rows).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className={classes.keyCell}>{key}</TableCell>
            <TableCell className={classes.valueCell}>
              <input
                className={classes.valueInput}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActionPropertiesTable;
