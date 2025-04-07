import React, { useCallback, useState, useEffect } from "react";
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
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import ActionPropertiesTable from "./ActionPropertiesTable";
import { ActionTableRow } from "./FeatureActionTableRow";
import { MSBActionName } from "../actions/MSBActionName";
import { defaultDotProps } from "../actions/Dot";
import { defaultCircleProps } from "../actions/Circle";
import { defaultTextBoxProps } from "../actions/TextBox";
import { defaultConnectorProperties } from "../actions/Connector";

const getInitialProperties = (action: MSBActionName) => {
  switch (action) {
    case MSBActionName.DOT:
      return defaultDotProps;
    case MSBActionName.CIRCLE:
      return defaultCircleProps;
    case MSBActionName.TEXT_BOX:
      return defaultTextBoxProps;
    case MSBActionName.CONNECTOR:
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
    width: "20%",
    // display: "flex",
    // alignItems: "center",
    fontSize: "12px",
    padding: "4px", // reduce padding
    // border: "none", // remove border
  },

  propertyCell: {
    width: "80%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    // border: "none", // remove border
  },
  // inputField: {
  //   height: "28px",
  // },
  selectField: {
    height: "30px",
  },
  removeIcon: {
    color: "red",
  },
  addIcon: {
    color: "green",
  },
});

interface ActionTableProps {
  data: ActionTableRow[];
  setData: React.Dispatch<React.SetStateAction<ActionTableRow[]>>;
}

const ActionTable: React.FC<ActionTableProps> = ({ data, setData }) => {
  console.log("ActionTable: re-rendered");

  const classes = useStyles();
  const [rows, setRows] = useState<ActionTableRow[]>(data);

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows(data); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleAddRow = () => {
    setRows([
      ...rows,
      { action: MSBActionName.DOT, properties: defaultDotProps },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleActionChange = (index: number, action: MSBActionName) => {
    console.log("ActionTable: index = ", index, ", action = ", action);

    const newRows = [...rows];
    newRows[index].action = action; // create a new object for the row;
    newRows[index].properties = getInitialProperties(action);
    setRows(newRows);
  };

  const handlePropertyChange = (index: number, properties: any) => {
    console.log("ActionTable: index = ", index, ", properties = ", properties);

    const newRows = [...rows];
    newRows[index].properties = properties;
    setRows(newRows);
  };

  return (
    <div>
      <Table className={classes.table}>
        {/* 
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>

            <TableCell>Properties</TableCell>
          </TableRow>
        </TableHead> 
        */}
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              {/* Action */}
              <TableCell className={classes.actionCell}>
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  aria-label="delete"
                >
                  <RemoveIcon className={classes.removeIcon} />
                </IconButton>
                <Select
                  className={classes.selectField}
                  value={row.action}
                  onChange={(e) =>
                    handleActionChange(index, e.target.value as MSBActionName)
                  }
                >
                  {Object.values(MSBActionName).map((action) => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              {/* Properties */}
              <TableCell className={classes.propertyCell}>
                <ActionPropertiesTable
                  key={index} // ensure each instance has a unique key
                  data={{ action: row.action, ...row.properties }}
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
        <AddIcon className={classes.addIcon} />
      </IconButton>
    </div>
  );
};

export default ActionTable;
