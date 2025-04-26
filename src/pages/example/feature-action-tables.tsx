import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

// local import
import * as msb from '../../msb';
// import from npm library
// import * as msb from 'meta-storyboard';

import covid19NumFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';
import mlNumFATableMirrored from '../../assets/feature-action-table/ml-numerical-fa-table-line.json';
import mlNumFATablePCP from '../../assets/feature-action-table/ml-numerical-fa-table-pcp.json';

const tableDataMap: { [tableName: string]: msb.FeatureActionTableData[] } = {
  'Covid19 Single Location': covid19NumFATable,
  'ML Provenance': mlNumFATableMirrored,
  'ML Multivariate': mlNumFATablePCP,
};

const FeatureActionTablesPage = () => {
  const [data, setData] = useState<msb.FeatureActionTableRow[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const _tables = Object.keys(tableDataMap) as string[];
      setTables(_tables);
      setSelectedTable(_tables[0]);
      console.log('tables: ', _tables);

      await fetchTableData(_tables[0]);
    };

    fetchData();
  }, []);

  const fetchTableData = async (table: string) => {
    try {
      console.log('table: ', table);
      const tableData = tableDataMap[table] as msb.FeatureActionTableRow[];
      console.log('tableData: ', tableData);
      setData(tableData);
    } catch (e) {
      console.error('Failed to fetch table data:', e);
    }
  };

  const handleTableChange = async (
    event: SelectChangeEvent<string>,
  ) => {
    setSelectedTable(event.target.value as string);
    if (event.target.value !== '') {
      fetchTableData(event.target.value as string);
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
        <title>Feature-Action Table</title>
      </Head>
      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: '100%',
          py: 8,
        }}
      >
        <Typography variant="h5" sx={{ mr: 2 }}>
          Experimental Feature
        </Typography>
        <br />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="table-select-label">Select Table</InputLabel>
              <Select
                labelId="table-select-label"
                value={selectedTable}
                onChange={handleTableChange}
                label="Select a Feature-Action Table"
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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
