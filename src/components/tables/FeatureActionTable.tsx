import React, { useCallback, useState, useEffect } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';

import {
  defaultDotProps,
  defaultCircleProps,
  defaultTextBoxProps,
  defaultConnectorProperties,
  ActionName,
} from '../actions';
import { NumericalFeatureName } from '../../types';
import { ActionTable, FeaturePropertiesTable } from './index';
import { FeatureActionTableRow } from './FeatureActionTableRow';

const getInitialProperties = (action: ActionName) => {
  switch (action) {
    case ActionName.DOT:
      return defaultDotProps;
    case ActionName.CIRCLE:
      return defaultCircleProps;
    case ActionName.TEXT_BOX:
      return defaultTextBoxProps;
    case ActionName.CONNECTOR:
      return defaultConnectorProperties;
    default:
      return {};
  }
};

// Define styled components to replace makeStyles
const StyledTable = styled(Table)({
  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

const StyledTableRow = styled(TableRow)({
  '&:not(:last-child)': {
    borderBottom: '1.5px solid #808080',
  },
});

const StyledTableCell = styled(TableCell)({
  fontSize: '12px',
});

// Style constants to use with sx prop
const styles = {
  featureHeadCell: {
    fontWeight: 'bold',
  },
  propertiesHeadCell: {
    fontWeight: 'bold',
  },
  rankHeadCell: {
    fontWeight: 'bold',
  },
  actionHeadCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureCell: {
    width: '15%',
    fontSize: '12px',
    padding: '4px',
  },
  propertyCell: {
    width: '15%',
    fontSize: '12px',
    padding: '2px',
  },
  rankCell: {
    width: '10%',
  },
  actionCell: {
    width: '60%',
  },
  rankTextField: {
    '& .MuiInputBase-root': {
      height: '30px',
      width: '100px',
    },
    '& .MuiInputBase-input': {
      height: '30px',
      padding: '0 14px',
    },
  },
  selectField: {
    height: '30px',
  },
  removeIcon: {
    color: 'red',
  },
  addIcon: {
    color: 'green',
  },
};

interface FeatureActionTableProps {
  data: FeatureActionTableRow[];
  setData: React.Dispatch<React.SetStateAction<FeatureActionTableRow[]>>;
}

export const FeatureActionTable: React.FC<FeatureActionTableProps> = ({
  data,
  setData,
}) => {
  console.log('FeatureActionTable: re-rendered');

  // No need for useStyles() with the new approach
  const [rows, setRows] = useState<FeatureActionTableRow[]>(data);

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows(data); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        feature: NumericalFeatureName.MAX, // Default feature
        properties: {}, // Empty condition
        rank: rows.length + 1, // Default rank
        actions: [{ action: ActionName.DOT, properties: defaultDotProps }], // Default action
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleActionChange = (index: number, feature: NumericalFeatureName) => {
    console.log('FeatureActionTable: index = ', index, ', action = ', feature);

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
    console.log('index: ', index, ', rank: ', rank);
    /*
    setEditCellId(id);
    setEditedValue(value.toString()); // Convert value to string for the TextField
    setColumnNameBeingEdited(columnName);
    */
  };

  return (
    <div>
      <StyledTable>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell sx={styles.featureHeadCell}>
              Feature
            </StyledTableCell>
            <StyledTableCell sx={styles.propertiesHeadCell}>
              Properties
            </StyledTableCell>
            <StyledTableCell sx={styles.rankHeadCell}>Rank</StyledTableCell>
            <StyledTableCell sx={styles.actionHeadCell}>
              Action & Properties
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <StyledTableRow key={index}>
              {/* Feature */}
              <StyledTableCell sx={styles.featureCell}>
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  aria-label="delete"
                >
                  <RemoveIcon sx={styles.removeIcon} />
                </IconButton>
                <Select
                  sx={styles.selectField}
                  value={row.feature}
                  onChange={(e) =>
                    handleActionChange(
                      index,
                      e.target.value as NumericalFeatureName,
                    )
                  }
                >
                  {Object.values(NumericalFeatureName).map((feature) => (
                    <MenuItem key={feature} value={feature}>
                      {feature}
                    </MenuItem>
                  ))}
                </Select>
              </StyledTableCell>

              {/* Properties */}
              <StyledTableCell sx={styles.propertyCell}>
                <FeaturePropertiesTable
                  key={index} // ensure each instance has a unique key
                  data={row.properties}
                  setData={(newProperties: any) =>
                    handlePropertyChange(index, newProperties)
                  }
                />
              </StyledTableCell>

              {/* Rank */}
              <StyledTableCell sx={styles.rankCell}>
                <TextField
                  sx={styles.rankTextField}
                  type="number"
                  key={index} // ensure each instance has a unique key
                  value={row.rank}
                  onChange={(e) =>
                    handleRankChange(index, parseInt(e.target.value, 10))
                  }
                />
              </StyledTableCell>

              {/* Actions */}
              <StyledTableCell sx={styles.actionCell}>
                <ActionTable
                  key={index} // ensure each instance has a unique key
                  data={row.actions}
                  setData={() => {}}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      <IconButton onClick={handleAddRow} aria-label="add">
        <AddIcon sx={styles.addIcon} />
      </IconButton>
    </div>
  );
};
