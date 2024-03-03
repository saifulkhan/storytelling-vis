import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

import { initialData } from "../../../mock/feature-action-mock";
import FeatureActionTableDialog from "./FeatureActionTableDialog"; // Import your FeatureActionTableDialog component

const FeatureActionTable = () => {
  const [data, setData] = useState(initialData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedRowData, setEditedRowData] = useState(null);
  const [editCellId, setEditCellId] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const handleEditCell = (id, value) => {
    setEditCellId(id);
    setEditedValue(value);
  };

  const handleSaveCell = (id, columnName) => {
    const updatedData = data.map((item) => {
      if (item.ID === id) {
        return { ...item, [columnName]: editedValue };
      }
      return item;
    });
    setData(updatedData);
    setEditCellId(null);
  };

  const handleAddRow = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditedRowData(null);
  };

  const handleSaveRow = (rowData) => {
    if (editedRowData) {
      const updatedData = data.map((item) =>
        item.ID === editedRowData.ID ? rowData : item,
      );
      setData(updatedData);
    } else {
      setData([...data, rowData]);
    }
    setOpenDialog(false);
    setEditedRowData(null);
  };

  const handleEditRow = (row) => {
    setEditedRowData(row);
    setOpenDialog(true);
  };

  const handleDeleteRow = (id) => {
    const updatedData = data.filter((item) => item.ID !== id);
    setData(updatedData);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Feature</TableCell>
              <TableCell>FeatureParams</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>ActionParams</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Edit/Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.ID}>
                {/* <TableCell>{row.ID}</TableCell> */}
                <TableCell>
                  {editCellId === row.ID ? (
                    <TextField
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      onBlur={() => handleSaveCell(row.ID, "ID")}
                    />
                  ) : (
                    <span onClick={() => handleEditCell(row.ID, row.ID)}>
                      {row.ID}
                    </span>
                  )}
                </TableCell>

                {/* <TableCell>{row.Feature}</TableCell> */}
                <TableCell>
                  {editCellId === row.ID ? (
                    <TextField
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      onBlur={() => handleSaveCell(row.ID, "Feature")}
                    />
                  ) : (
                    <span onClick={() => handleEditCell(row.ID, row.Feature)}>
                      {row.Feature}
                    </span>
                  )}
                </TableCell>

                {/* Display FeatureParams as key-value pairs */}
                <TableCell>
                  {Object.keys(row.FeatureParams).map((key) => (
                    <div key={key}>
                      {key}: {row.FeatureParams[key]}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{row.Rank}</TableCell>
                <TableCell>{row.Action}</TableCell>
                <TableCell>
                  {/* Display ActionParams as key-value pairs */}
                  {Object.keys(row.ActionParams).map((key) => (
                    <div key={key}>
                      {key}: {row.ActionParams[key]}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{row.Text}</TableCell>
                <TableCell>{row.Comment}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditRow(row)}>Edit</Button>
                  <Button onClick={() => handleDeleteRow(row.ID)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleAddRow}>Add Row</Button>

      <FeatureActionTableDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveRow}
        rowData={editedRowData}
      />
    </div>
  );
};

export default FeatureActionTable;
