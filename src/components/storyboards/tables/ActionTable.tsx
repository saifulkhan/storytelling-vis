import React, { useCallback, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ActionPropertiesTable from "./ActionPropertiesTable";
import { ActionTableRowType } from "./FeatureActionTableRowType";
import { ActionEnum } from "../actions/ActionEnum";

import { defaultDotProperties } from "../actions/Dot";
import { defaultCircleProperties } from "../actions/Circle";
import { defaultTextBoxProperties } from "../actions/TextBox";
import { defaultConnectorProperties } from "../actions/Connector";

const getInitialProperties = (action: ActionEnum) => {
  switch (action) {
    case ActionEnum.DOT:
      return defaultDotProperties;
    case ActionEnum.CIRCLE:
      return defaultCircleProperties;
    case ActionEnum.TEXT_BOX:
      return defaultTextBoxProperties;
    case ActionEnum.CONNECTOR:
      return defaultConnectorProperties;
    default:
      return {};
  }
};

const useStyles = makeStyles({
  table: {
    width: "100%",
    borderCollapse: "collapse", // remove border collapse
  },
  // button: {
  //   margin: "10px",
  // },
  actionCell: {
    width: "10%",
    // display: "flex",
    // alignItems: "center",
    fontSize: "12px",
    padding: "4px", // reduce padding
    // border: "none", // remove border
  },

  propertyCell: {
    width: "90%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    border: "none", // remove border
  },
  // inputField: {
  //   height: "28px",
  // },
  selectField: {
    // height: "24px",
  },
});

const ActionTable = ({ data, setData }) => {
  console.log("ActionTable re-rendered");

  const classes = useStyles();
  const [rows, setRows] = useState<ActionTableRowType[]>(data);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { action: ActionEnum.DOT, properties: defaultDotProperties },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleActionChange = (index: number, action: ActionEnum) => {
    console.log("ActionTable: index = ", index, ", action = ", action);

    const newRows = [...rows];
    newRows[index].action = action; // create a new object for the row;
    newRows[index].properties = getInitialProperties(action);
    setRows(newRows);
  };

  // const handlePropertyChange = useCallback((index, properties) => {
  //   console.log("ActionTable: index = ", index, ", properties = ", properties);

  //   const newRows = [...rows];
  //   newRows[index].properties = properties;
  //   setRows(newRows);
  // }, []);

  const handlePropertyChange = (index: number, properties: any) => {
    console.log("ActionTable: index = ", index, ", properties = ", properties);

    const newRows = [...rows];
    newRows[index].properties = properties;
    setRows(newRows);
  };

  return (
    <div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>

            <TableCell>Properties</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className={classes.actionCell}>
                {/* <div className={classes.actionCell}> */}
                <Select
                  className={classes.selectField}
                  value={row.action}
                  onChange={(e) =>
                    handleActionChange(index, e.target.value as ActionEnum)
                  }
                >
                  {Object.values(ActionEnum).map((action) => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </Select>
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                {/* </div> */}
              </TableCell>
              <TableCell className={classes.propertyCell}>
                <ActionPropertiesTable
                  key={index} // ensure each instance has a unique key
                  data={row.properties}
                  setData={(updatedProperties) =>
                    handlePropertyChange(index, updatedProperties)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton onClick={handleAddRow} aria-label="add">
        <AddIcon></AddIcon>
      </IconButton>
    </div>
  );
};

export default ActionTable;
