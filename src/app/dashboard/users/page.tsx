'use client';
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import columndefinitions from './columndefinitions.json';
import rowdata from './rowdata.json';
import { config } from '@/config';
import Stack from '@mui/material/Stack';


// Import the necessary AG-Grid modules
//import { ClientSideRowModelModule } from 'ag-grid-community';

// Define the types for your data
interface Employee {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
}

export default function Page(): React.JSX.Element {
    const [rows] = useState<Employee[]>(rowdata);
    
    const [cols] = useState(columndefinitions);

      return (
        <Stack>
        <div style={{ height: '100vh', width: '100%' }}>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              columnDefs={cols}
              rowData={rows}
              pagination={true} // Enable pagination
              domLayout="autoHeight" // Automatically adjust grid height
              paginationPageSize={10} // Pagination page size
              paginationPageSizeOptions={[5, 10, 20, 50]} // Options for page sizes
              paginationPageSizeSelector={false}
              //modules={[ClientSideRowModelModule]} // Import the necessary module here
            />
          </div>
        </div>
        </Stack>
      );
};