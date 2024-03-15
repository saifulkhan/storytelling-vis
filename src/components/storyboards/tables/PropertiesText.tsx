import React, { useState, useEffect } from "react";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
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
    // border: "none", // remove border
    padding: "2px", // adjust padding for input
    // boxSizing: "border-box", // include padding and border in width and height
    "&:before": {
      // Underline CSS for before interaction
      borderBottom: "none",
    },
    "&:hover:not(.Mui-disabled):before": {
      // Underline CSS on hover
      borderBottom: "none",
    },
    "&:after": {
      // Underline CSS for after interaction (e.g., on blur)
      borderBottom: "none",
    },
  },
  drawingCell: {
    width: "10%",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none", // remove lines between cells
  },
});

interface PropertiesTextProps {
  data: Record<string, any>;
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const PropertiesText: React.FC<PropertiesTextProps> = ({ data, setData }) => {
  // console.log("PropertiesText: re-rendered: data = ", data);

  const classes = useStyles();
  const [rows, setRows] = useState({ ...data });

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows({ ...data }); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleInputChange = (key: string, value: any) => {
    const updatedData = { ...rows, [key]: value };
    setRows(updatedData);
    // console.log("PropertiesText: rows = ", rows);
    // console.log("PropertiesText: updatedData = ", updatedData);
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
                  <TextField
                    // variant="standard"
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

export default PropertiesText;
