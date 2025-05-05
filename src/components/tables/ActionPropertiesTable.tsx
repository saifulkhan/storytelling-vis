import React, { useState, useEffect, useRef } from 'react';
import { Input, Table, TableBody, TableCell, TableRow } from '@mui/material';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';

import {
  ActionName,
  CircleProps,
  ConnectorProps,
  DotProps,
  TextBoxProps,
  PauseProps,
} from '../actions';
import { ActionFactory } from '../../factory';

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
    width: '20%',
    fontSize: '12px',
    padding: '2px',
    border: 'none',
  },
  valueCell: {
    width: '60%',
    fontSize: '12px',
    padding: '2px',
    border: 'none',
  },
  valueInput: {
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
  drawingCell: {
    width: '10%',
    padding: '2px',
    border: 'none',
  },
};

interface ActionPropertiesTableProps {
  data: Record<string, any>;
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const ActionPropertiesTable: React.FC<ActionPropertiesTableProps> = ({
  data,
  setData,
}) => {
  // console.log("ActionPropertiesTable: re-rendered: data = ", data);
  // No need for useStyles() with the new approach
  const [rows, setRows] = useState({ ...data });
  const chartRef = useRef<SVGSVGElement | null>(null);

  const actionFactory = new ActionFactory();

  // this effect will trigger whenever data (input argument) changes
  useEffect(() => {
    setRows({ ...data }); // updating state directly
  }, [data]); // trigger effect when data changes

  const handleInputChange = (key: string, value: any) => {
    const updatedData = { ...rows, [key]: value };
    setRows(updatedData);
    // console.log("ActionPropertiesTable: rows = ", rows);
    // console.log("ActionPropertiesTable: updatedData = ", updatedData);
    setData(updatedData); // update the parent component's data
  };

  const entries = Object.entries(rows).filter(
    ([key]) => key !== 'id' && key !== 'action',
  );
  const totalRows = entries.length;

  function drawSvgObject(data: Record<string, any>) {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const height = 75 - margin.top - margin.bottom;
    const width = 100 - margin.left - margin.right;
    d3.select(chartRef.current).select('svg').remove();
    const svg = d3.select(chartRef.current).append('svg').node();

    if (data.action == ActionName.TEXT_BOX) {
      data.width = 80;
      data.title = 'Title';
      data.message = 'Message';
    }
    console.log({ ...data });
    // Cast data to the appropriate props type based on action name
    const action = actionFactory.create(
      data.action,
      data as
        | CircleProps
        | ConnectorProps
        | DotProps
        | TextBoxProps
        | PauseProps,
    );
    action
      ?.setCanvas(chartRef.current as unknown as SVGGElement)
      .setCoordinate([
        [50, 75],
        [50, 50],
      ])
      .show();

    return (
      <svg
        ref={chartRef}
        style={{ width: width, height: height, border: '0px solid' }}
      ></svg>
    );
  }

  return (
    <StyledTable>
      <TableBody>
        {entries.map(([key, value], index) => (
          <StyledTableRow key={key}>
            <StyledTableCell sx={styles.keyCell}>
              <Input
                disableUnderline
                sx={styles.valueInput}
                type="text"
                value={key}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </StyledTableCell>
            <StyledTableCell sx={styles.valueCell}>
              <Input
                disableUnderline
                sx={styles.valueInput}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};
