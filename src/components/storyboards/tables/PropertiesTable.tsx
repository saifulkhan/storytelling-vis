import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
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
    width: "70%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none", // remove lines between cells
  },
  valueInput: {
    width: "100%",
    height: "100%",
    fontSize: "12px",
    border: "none", // remove border
    padding: "2px", // adjust padding for input
    boxSizing: "border-box", // include padding and border in width and height
  },
  drawingCell: {
    width: "10%",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none", // remove lines between cells
  },
});

interface PropertiesTableProps {
  data: Record<string, any>;
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({ data, setData }) => {
  // console.log("PropertiesTable: re-rendered: data = ", data);

  const classes = useStyles();
  const [rows, setRows] = useState({ ...data });

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows({ ...data }); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleInputChange = (key: string, value: any) => {
    const updatedData = { ...rows, [key]: value };
    setRows(updatedData);
    // console.log("PropertiesTable: rows = ", rows);
    // console.log("PropertiesTable: updatedData = ", updatedData);
    setData(updatedData); // update the parent component's data
  };

  return (
    <Table className={classes.table}>
      <TableBody>
        {Object.entries(rows).map(
          ([key, value]) =>
            // skip rendering if key is "id"
            key !== "id" && (
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
                {/* <TableCell className={classes.drawingCell}>{key}</TableCell> */}
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default PropertiesTable;
