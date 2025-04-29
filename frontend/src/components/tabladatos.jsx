import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const TablaDatos = ({ datos, columnas }) => {
  return (
    <Box sx={{ height: 600, width: '100%', mt: 3 ,overflowX: 'auto'}}>
      <DataGrid
        rows={datos}
        columns={columnas}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
};

export default TablaDatos;
