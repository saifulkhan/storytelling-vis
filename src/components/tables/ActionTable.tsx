import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';

import { ActionPropertiesTable } from './ActionPropertiesTable';
import { ActionTableRow } from './FeatureActionTableRow';
import {
  ActionName,
  defaultDotProps,
  defaultCircleProps,
  defaultTextBoxProps,
  defaultConnectorProperties,
} from '../actions';

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
      // Return defaultDotProps instead of empty object to satisfy type constraints
      return defaultDotProps;
  }
};

// Define styled components to replace makeStyles
const StyledTable = styled(Table)({
  width: '100%',
  borderCollapse: 'collapse',
});

const StyledTableRow = styled(TableRow)({
  // No specific styling needed
});

const StyledTableCell = styled(TableCell)({
  fontSize: '12px',
});

// Style constants to use with sx prop
const styles = {
  actionCell: {
    width: '20%',
    fontSize: '12px',
    padding: '4px',
  },
  propertyCell: {
    width: '80%',
    fontSize: '12px',
    padding: '2px',
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

interface ActionTableProps {
  data: ActionTableRow[];
  setData: React.Dispatch<React.SetStateAction<ActionTableRow[]>>;
}

export const ActionTable: React.FC<ActionTableProps> = ({ data, setData }) => {
  console.log('ActionTable: re-rendered');

  // No need for useStyles() with the new approach
  const [rows, setRows] = useState<ActionTableRow[]>(data);

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows(data); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleAddRow = () => {
    setRows([...rows, { action: ActionName.DOT, properties: defaultDotProps }]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleActionChange = (index: number, action: ActionName) => {
    console.log('ActionTable: index = ', index, ', action = ', action);

    const newRows = [...rows];
    newRows[index].action = action; // create a new object for the row;
    newRows[index].properties = getInitialProperties(action);
    setRows(newRows);
  };

  const handlePropertyChange = (index: number, properties: any) => {
    console.log('ActionTable: index = ', index, ', properties = ', properties);

    const newRows = [...rows];
    newRows[index].properties = properties;
    setRows(newRows);
  };

  return (
    <div>
      <StyledTable>
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
            <StyledTableRow key={index}>
              {/* Action */}
              <StyledTableCell sx={styles.actionCell}>
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  aria-label="delete"
                >
                  <RemoveIcon sx={styles.removeIcon} />
                </IconButton>
                <Select
                  sx={styles.selectField}
                  value={row.action}
                  onChange={(e) =>
                    handleActionChange(index, e.target.value as ActionName)
                  }
                >
                  {Object.values(ActionName).map((action) => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </Select>
              </StyledTableCell>

              {/* Properties */}
              <StyledTableCell sx={styles.propertyCell}>
                <ActionPropertiesTable
                  key={index} // ensure each instance has a unique key
                  data={{ action: row.action, ...row.properties }}
                  setData={(updatedProperties: any) =>
                    handlePropertyChange(index, updatedProperties)
                  }
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
