import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  table: {
    width: "100%",
    borderCollapse: "collapse", // remove border collapse
  },
  keyCell: {
    display: "flex", // Add this line
    alignItems: "center", // Center items vertically
    width: "50%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none",
  },
  valueCell: {
    width: "50%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
    // borderBottom: "none", // remove lines between cells
  },
  valueInput: {
    flexGrow: 1, // Allow the input to fill available space
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
  addIcon: {
    color: "green",
    fontSize: "small",
  },
  removeIcon: {
    color: "red",
    fontSize: "small",
  },
});

interface FeaturePropertiesTableProps {
  data: Record<string, any>;
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const FeaturePropertiesTable: React.FC<FeaturePropertiesTableProps> = ({
  data,
  setData,
}) => {
  // console.log("FeaturePropertiesTable: re-rendered: data = ", data);
  const classes = useStyles();
  const [rows, setRows] = useState({ ...data });

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows({ ...data }); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleInputChange = (key: string, value: any) => {
    const updatedData = { ...rows, [key]: value };
    setRows(updatedData);
    // console.log("FeaturePropertiesTable: rows = ", rows);
    // console.log("FeaturePropertiesTable: updatedData = ", updatedData);
    setData(updatedData); // update the parent component's data
  };

  const handleAddRow = () => {
    // setRows([
    //   ...rows,
    //   { action: Actions.DOT, properties: defaultDotProperties },
    // ]);
  };

  const handleRemoveRow = (index: number) => {
    // const newRows = [...rows];
    // newRows.splice(index, 1);
    // setRows(newRows);
  };

  const entries = Object.entries(rows).filter(
    ([key]) => key !== "id" && key !== "action"
  );
  const totalRows = entries.length;

  return (
    <>
      <Table className={classes.table}>
        <TableBody>
          {entries.map(([key, value], index) => (
            <TableRow key={key}>
              <TableCell className={classes.keyCell}>
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  aria-label="delete"
                >
                  <RemoveIcon className={classes.removeIcon} />
                </IconButton>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton onClick={handleAddRow} aria-label="add">
        <AddIcon className={classes.addIcon} />
      </IconButton>
    </>
  );
};

export default FeaturePropertiesTable;
