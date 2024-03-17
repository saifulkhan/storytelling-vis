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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ActionPropertiesTable from "./ActionPropertiesTable";
import { ActionTableRow, FeatureActionTableRow } from "./FeatureActionTableRow";
import { Actions } from "../actions/Actions";

import { defaultDotProps } from "../actions/Dot";
import { defaultCircleProps } from "../actions/Circle";
import { defaultTextBoxProps } from "../actions/TextBox";
import { defaultConnectorProperties } from "../actions/Connector";
import { NumericalFeatures } from "../../../utils/storyboards/feature/NumericalFeatures";
import ActionTable from "./ActionTable";
import FeaturePropertiesTable from "./FeaturePropertiesTable";

const getInitialProperties = (action: Actions) => {
  switch (action) {
    case Actions.DOT:
      return defaultDotProps;
    case Actions.CIRCLE:
      return defaultCircleProps;
    case Actions.TEXT_BOX:
      return defaultTextBoxProps;
    case Actions.CONNECTOR:
      return defaultConnectorProperties;
    default:
      return {};
  }
};

const useStyles = makeStyles({
  table: {
    width: "100%",
    borderCollapse: "collapse", // remove border collapse
    borderSpacing: 0, // removes default spacing to control borders effectively
  },
  featureHeadCell: {
    fontWeight: "bold", // header to be bold
  },
  propertiesHeadCell: {
    fontWeight: "bold", // header to be bold
  },
  rankHeadCell: {
    fontWeight: "bold", // header to be bold
  },
  actionHeadCell: {
    fontWeight: "bold", // header to be bold
    textAlign: "center", // center align text
  },
  tableRow: {
    "&:not(:last-child)": {
      // Adds horizontal border to all but the last row for a cleaner look
      borderBottom: "1.5px solid #808080", // Adjust color as needed
    },
  },
  // button: {
  //   margin: "10px",
  // },
  featureCell: {
    width: "10%",
    // display: "flex",
    // alignItems: "center",
    fontSize: "12px",
    padding: "4px", // reduce padding
    // border: "none", // remove border
  },

  propertyCell: {
    width: "15%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    // border: "none", // remove border
  },
  rankCell: {
    width: "10%",
    // fontSize: "12px",
    // padding: "2px", // reduce padding
    // border: "none", // remove border
  },
  actionCell: {
    width: "65%",
    // fontSize: "12px",
    // padding: "2px", // reduce padding
    // border: "none", // remove border
  },
  rankTextField: {
    "& .MuiInputBase-root": {
      // Target the input field container
      height: "30px", // Set the height of the input
      width: "100px", // Set the width of the input
    },
    "& .MuiInputBase-input": {
      // Target the input element itself
      height: "30px",
      padding: "0 14px", // Adjust padding as needed
    },
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

interface FeatureActionTableProps {
  data: FeatureActionTableRow[];
  setData: React.Dispatch<React.SetStateAction<FeatureActionTableRow[]>>;
}

const FeatureActionTable: React.FC<FeatureActionTableProps> = ({
  data,
  setData,
}) => {
  console.log("FeatureActionTable: re-rendered");

  const classes = useStyles();
  const [rows, setRows] = useState<FeatureActionTableRow[]>(data);

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows(data); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleAddRow = () => {
    setRows([...rows, { action: Actions.DOT, properties: defaultDotProps }]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleActionChange = (index: number, feature: NumericalFeatures) => {
    console.log("FeatureActionTable: index = ", index, ", action = ", feature);

    /*
    const newRows = [...rows];
    newRows[index].action = feature; // create a new object for the row;
    newRows[index].properties = getInitialProperties(feature);
    setRows(newRows);
    */
  };

  const handlePropertyChange = (index: number, properties: any) => {
    // prettier-ignore
    console.log("FeatureActionTable: index = ", index, ", properties = ", properties);

    /*
    const newRows = [...rows];
    newRows[index].properties = properties;
    setRows(newRows);
    */
  };

  const handleRankChange = (index: number, rank: number) => {
    console.log("index: ", index, ", rank: ", rank);
    /*
    setEditCellId(id);
    setEditedValue(value.toString()); // Convert value to string for the TextField
    setColumnNameBeingEdited(columnName);
    */
  };

  return (
    <div>
      <Table className={classes.table}>
        <TableHead className={classes.tableRow}>
          <TableRow className={classes.tableRow}>
            <TableCell className={classes.featureHeadCell}>Feature</TableCell>
            <TableCell className={classes.propertiesHeadCell}>
              Properties
            </TableCell>
            <TableCell className={classes.rankHeadCell}>Rank</TableCell>
            <TableCell className={classes.actionHeadCell}>
              Action & Properties
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index} className={classes.tableRow}>
              {/* Feature */}
              <TableCell className={classes.featureCell}>
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  aria-label="delete"
                >
                  <RemoveIcon className={classes.removeIcon} />
                </IconButton>
                <Select
                  className={classes.selectField}
                  value={row.feature}
                  onChange={(e) =>
                    handleActionChange(
                      index,
                      e.target.value as NumericalFeatures
                    )
                  }
                >
                  {Object.values(NumericalFeatures).map((feature) => (
                    <MenuItem key={feature} value={feature}>
                      {feature}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              {/* Properties */}
              <TableCell className={classes.propertyCell}>
                <FeaturePropertiesTable
                  key={index} // ensure each instance has a unique key
                  data={row.properties}
                  setData={(newProperties) =>
                    handlePropertyChange(index, newProperties)
                  }
                />
              </TableCell>

              {/* Rank */}
              <TableCell className={classes.rankCell}>
                <TextField
                  className={classes.rankTextField}
                  type="number"
                  key={index} // ensure each instance has a unique key
                  value={row.rank}
                  onChange={(e) => handleRankChange(index, e.target.value)}
                />
              </TableCell>

              {/* Actions */}
              <TableCell className={classes.actionCell}>
                <ActionTable
                  key={index} // ensure each instance has a unique key
                  data={row.actions}
                  setData={() => {}}
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

export default FeatureActionTable;
