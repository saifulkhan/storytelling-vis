import React, { useState, useEffect } from "react";
import {
  IconButton,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField, // Import TextField for editing keys
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
  const classes = useStyles();
  const [rows, setRows] = useState({ ...data });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");

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
      setNewKey("");
      return;
    }

    const updatedData = { ...rows, [newKey]: rows[oldKey] };
    delete updatedData[oldKey]; // Remove old key
    setRows(updatedData);
    setData(updatedData);
    setEditingKey(null);
    setNewKey("");
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
      newKey += "1";
    }
    const newRows = { ...rows, [newKey]: "newValue" };
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
      <Table className={classes.table}>
        <TableBody>
          {Object.entries(rows).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className={classes.keyCell}>
                <IconButton
                  onClick={() => handleRemoveRow(key)}
                  aria-label="delete"
                >
                  <RemoveIcon className={classes.removeIcon} />
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
              </TableCell>
              <TableCell className={classes.valueCell}>
                <Input
                  disableUnderline
                  className={classes.valueInput}
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(key, e.target.value)}
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
