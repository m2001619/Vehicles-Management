import React from 'react';
import { Box, CircularProgress, Paper } from '@mui/material';

const TableLoader = () => {
  return (
    <Paper>
      <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    </Paper>
  );
};

export default TableLoader;
