import { useEffect, useState } from "react";
import Head from "next/head";
import {
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

import FeatureActionTable from "src/components/tables/FeatureActionTable";
import { FeatureActionTableRow } from "src/components/tables/FeatureActionTableRow";
import { getTableData, getTables, type TableName } from "src/services/FATableService";

const FeatureActionTablesPage = () => {
  const [data, setData] = useState<FeatureActionTableRow[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableName | "">("");
  const [tables, setTables] = useState<TableName[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const _tables = getTables();
      setTables(_tables);
      setSelectedTable(_tables[0]);
      console.log("tables: ", _tables);

      await fetchTableData(_tables[0]);
    };

    fetchData();
  }, []);

  const fetchTableData = async (table: TableName) => {
    try {
      console.log("table: ", table);
      const tableData = (await getTableData(table)) as FeatureActionTableRow[];
      console.log("tableData: ", tableData);
      setData(tableData);
    } catch (e) {
      console.error("Failed to fetch table data:", e);
    }
  };

  const handleTableChange = async (event: SelectChangeEvent<TableName | "">) => {
    setSelectedTable(event.target.value as TableName | "");
    if (event.target.value !== "") {
      fetchTableData(event.target.value as TableName);
    }
  };

  const handleCreateTable = () => {
    // TODO: Implement logic to create a new table
  };

  const handleSaveTable = () => {
    // TODO: Implement logic to save the existing table
  };

  return (
    <>
      <Head>
        <title>Feature Action Table</title>
      </Head>
      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="table-select-label">Select Table</InputLabel>
              <Select
                labelId="table-select-label"
                value={selectedTable}
                onChange={handleTableChange}
                label="Select Table"
              >
                <MenuItem value="">Select a table</MenuItem>
                {tables.map((table) => (
                  <MenuItem key={table} value={table}>
                    {table}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button variant="contained" disabled onClick={handleCreateTable}>
              New
            </Button>
            <Box sx={{ width: 8 }} /> {/* Add space between buttons */}
            <Button variant="contained" disabled onClick={handleSaveTable}>
              Save
            </Button>
          </Box>
        </Box>
        <FeatureActionTable data={data} setData={setData} />
      </Box>
    </>
  );
};

export default FeatureActionTablesPage;
