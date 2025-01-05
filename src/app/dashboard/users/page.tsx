'use client';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  CsvExportModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  PinnedRowModule,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";

import { Button, Card, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Stack from '@mui/material/Stack';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import columndefinitions from './columndefinitions.json';
import rowdata from './rowdata.json';

ModuleRegistry.registerModules([
  AdvancedFilterModule,
  CsvExportModule,
  RowSelectionModule,
  TextFilterModule,
  PinnedRowModule,
  CellStyleModule ,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  FiltersToolPanelModule,
  SetFilterModule,
  RowGroupingModule,
  NumberFilterModule,
  PaginationModule ,
  QuickFilterModule,
  ValidationModule /* Development Only */,
]);

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
  const [rows] = useState(rowdata);
  const [cols] = useState(columndefinitions);

  const [advFilterEnabled, setAdvFilterEnabled] = useState(false); 
  const [filterEnabled, setFilterEnabled] = useState(false); 


  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      enableRowGroup: true,
      enableValue: true,
      filter: true,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);


  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);


    const toggleAdvancedFilter = () => {
      setAdvFilterEnabled(!advFilterEnabled);
    };

    const toggleFilter = () => {
      setFilterEnabled(!filterEnabled);
    };


    const onFilterTextBoxChanged = useCallback(() => {
      gridRef.current!.api.setGridOption(
        "quickFilterText",
        (document.getElementById("filter-text-box") as HTMLInputElement).value,
      );
    }, []);
  
 
    const quickFilterParser = useCallback((quickFilter: string) => {
      const quickFilterParts = [];
      let lastSpaceIndex = -1;
      const isQuote = (index: number) => quickFilter[index] === '"';
      const getQuickFilterPart = (
        lastSpaceIndex: number,
        currentIndex: number,
      ) => {
        const startsWithQuote = isQuote(lastSpaceIndex + 1);
        const endsWithQuote = isQuote(currentIndex - 1);
        const startIndex =
          startsWithQuote && endsWithQuote
            ? lastSpaceIndex + 2
            : lastSpaceIndex + 1;
        const endIndex =
          startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
        return quickFilter.slice(startIndex, endIndex);
      };
      for (let i = 0; i < quickFilter.length; i++) {
        const char = quickFilter[i];
        if (char === " ") {
          if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
            quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
            lastSpaceIndex = i;
          }
        }
      }
      if (lastSpaceIndex !== quickFilter.length - 1) {
        quickFilterParts.push(
          getQuickFilterPart(lastSpaceIndex, quickFilter.length),
        );
      }
      return quickFilterParts;
    }, []);
  
    const quickFilterMatcher = useCallback(
      (quickFilterParts: string[], rowQuickFilterAggregateText: string) => {
        let result: boolean;
        try {
          result = quickFilterParts.every((part) =>
            rowQuickFilterAggregateText.match(part),
          );
        } catch {
          result = false;
        }
        return result;
      },
      [],
    );
  
    const onBtnExport = useCallback(() => {
      gridRef.current!.api.exportDataAsCsv();
    }, []);
    

/*     const onPdfExport = () => {
      if (gridRef.current) {
        gridRef.current!.api.exportDataAsPdf({
          // You can pass options here to customize the PDF
          columnWidth: 150,
          pageSize: 'A4',
          fileName: 'grid-export.pdf',
          // More customization options (page margins, PDF orientation, etc.) can be added here
        });
      }
    };
 */
  return (

    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4">Users</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
            Import
          </Button>
          <Button color="inherit" onClick={onBtnExport} startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
            Export
          </Button>
          <Button color="inherit" onClick={toggleAdvancedFilter} startIcon={<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />}>
          Advanced Filter
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={0.5} height={0.5} sx={{ alignItems: 'right' }}>

        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
          Add
        </Button><></>
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
          Edit
        </Button>
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
          Delete
        </Button>
      </Stack>
    </Stack>
    <Stack>
      <div>

      <Card sx={{ p: 2 , spacing: 3}}>
      <OutlinedInput
        id="filter-text-box"
        defaultValue=""
        fullWidth
        placeholder="Quick Filter..."
        onInput={onFilterTextBoxChanged}
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>

{/*       <input
            type="text"
            id="filter-text-box"
            placeholder="Quick Filter..."
            onInput={onFilterTextBoxChanged}
          />
              <button onClick={toggleAdvancedFilter}>
        Advanced Filter
      </button>
 */}
    </div>
    <div className="example-header">
{/*     <button onClick={toggleFilter}>
        Filter
      </button> */}      
      {/* <button onClick={onBtnExport}>Download CSV export file</button>       */}
      {/* <button onClick={onPdfExport}>Export to PDF</button> */}
        </div>
      <div id="myGrid" style={gridStyle}>
        <AgGridReact
          columnDefs={cols}
          rowData={rows}
          ref={gridRef}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          domLayout="autoHeight" // Automatically adjust grid height
          pagination={true}
          paginationPageSize={5} // Pagination page size
          paginationPageSizeSelector={[5, 10, 20, 50]}
          enableAdvancedFilter={advFilterEnabled}
          sideBar={true}
          cacheQuickFilter={true}
          quickFilterParser={quickFilterParser}
          quickFilterMatcher={quickFilterMatcher}

         //modules={[ClientSideRowModelModule]} // Import the necessary module here
        />
      </div>
    </Stack>
  </Stack>


  );
};