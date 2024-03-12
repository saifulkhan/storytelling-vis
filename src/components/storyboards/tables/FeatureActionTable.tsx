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
import PropertiesTable from "./PropertiesTable";
import { ActionTableRow, FeatureActionTableRow } from "./TableRows";
import { Actions } from "../actions/Actions";

import { defaultDotProperties } from "../actions/Dot";
import { defaultCircleProperties } from "../actions/Circle";
import { defaultTextBoxProperties } from "../actions/TextBox";
import { defaultConnectorProperties } from "../actions/Connector";
import { NumericalFeatures } from "../../../utils/storyboards/feature/NumericalFeatures";
import ActionTable from "./ActionTable";

const getInitialProperties = (action: Actions) => {
  switch (action) {
    case Actions.DOT:
      return defaultDotProperties;
    case Actions.CIRCLE:
      return defaultCircleProperties;
    case Actions.TEXT_BOX:
      return defaultTextBoxProperties;
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
    width: "10%",
    fontSize: "12px",
    padding: "2px", // reduce padding
    // border: "none", // remove border
  },

  actionCell: {
    width: "60%",
    // fontSize: "12px",
    // padding: "2px", // reduce padding
    // border: "none", // remove border
  },
  rankCell: {
    width: "10%",
    // fontSize: "12px",
    // padding: "2px", // reduce padding
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
    setRows([
      ...rows,
      { action: Actions.DOT, properties: defaultDotProperties },
    ]);
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

  return (
    <div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Feature</TableCell>
            <TableCell>Properties</TableCell>
            <TableCell>Rank</TableCell>
            <TableCell>Action & Properties</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
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
                <PropertiesTable
                  key={index} // ensure each instance has a unique key
                  data={row.properties}
                  setData={(updatedProperties) =>
                    handlePropertyChange(index, updatedProperties)
                  }
                />
              </TableCell>

              {/* Rank */}
              <TableCell className={classes.rankCell}>
                {/* <ActionTable
                  key={index} // ensure each instance has a unique key
                  data={row.actions}
                  setData={() => {}}
                /> */}
                {row.rank}
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
