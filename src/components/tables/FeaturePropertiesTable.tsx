import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField, // Import TextField for editing keys
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';

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
  padding: '2px',
  border: 'none',
});

// Style constants to use with sx prop
const styles = {
  keyCell: {
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    fontSize: '12px',
    padding: '2px',
    border: 'none',
  },
  valueCell: {
    width: '50%',
    fontSize: '12px',
    padding: '2px',
    border: 'none',
  },
  valueInput: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    fontSize: '12px',
    padding: '2px',
    '& input': {
      border: 'none',
      outline: 'none',
      padding: '1px',
    },
  },
  addIcon: {
    color: 'green',
    fontSize: 'small',
  },
  removeIcon: {
    color: 'red',
    fontSize: 'small',
  },
};

interface FeaturePropertiesTableProps {
  data: Record<string, any>;
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const FeaturePropertiesTable: React.FC<FeaturePropertiesTableProps> = ({
  data,
  setData,
}) => {
  // No need for useStyles() with the new approach
  const [rows, setRows] = useState({ ...data });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');

  useEffect(() => {
    setRows({ ...data });
    console.log(data);
  }, [data]);

  const handleValueChange = (key: string, newValue: any) => {
    const updatedData = { ...rows, [key]: newValue };
    setRows(updatedData);
    setData(updatedData);
  };

  const handleKeyChange = (oldKey: string) => {
    if (!newKey.trim() || rows.hasOwnProperty(newKey) || newKey === oldKey) {
      // Reset without change if newKey is invalid or already exists
      setEditingKey(null);
      setNewKey('');
      return;
    }

    const updatedData = { ...rows, [newKey]: rows[oldKey] };
    delete updatedData[oldKey]; // Remove old key
    setRows(updatedData);
    setData(updatedData);
    setEditingKey(null);
    setNewKey('');
  };

  const handleEditKey = (key: string) => {
    setEditingKey(key);
    setNewKey(key);
  };

  const handleAddRow = () => {
    // generate a unique key
    let newKey = `newKey${Object.keys(rows).length + 1}`;
    while (rows.hasOwnProperty(newKey)) {
      // simple way to ensure uniqueness
      newKey += '1';
    }
    const newRows = { ...rows, [newKey]: 'newValue' };
    setRows(newRows);
    setData(newRows);
  };

  const handleRemoveRow = (keyToRemove: string) => {
    // destructure to omit the key to remove
    const { [keyToRemove]: _, ...newRows } = rows;
    setRows(newRows);
    setData(newRows);
  };

  // The rest of your component remains largely unchanged...

  return (
    <>
      <StyledTable>
        <TableBody>
          {Object.entries(rows).map(([key, value]) => (
            <StyledTableRow key={key}>
              <StyledTableCell sx={styles.keyCell}>
                <IconButton
                  onClick={() => handleRemoveRow(key)}
                  aria-label="delete"
                >
                  <RemoveIcon sx={styles.removeIcon} />
                </IconButton>
                {editingKey === key ? (
                  <TextField
                    size="small"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    onBlur={() => handleKeyChange(key)}
                    autoFocus
                  />
                ) : (
                  <span onDoubleClick={() => handleEditKey(key)}>{key}</span>
                )}
              </StyledTableCell>
              <StyledTableCell sx={styles.valueCell}>
                <Input
                  disableUnderline
                  sx={styles.valueInput}
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(key, e.target.value)}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      <IconButton onClick={handleAddRow} aria-label="add">
        <AddIcon sx={styles.addIcon} />
      </IconButton>
    </>
  );
};
