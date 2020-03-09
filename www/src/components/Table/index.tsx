import React, { lazy, Suspense, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import _isEmpty from "lodash/isEmpty";

import { useTheme, Grid, CircularProgress } from "@material-ui/core";

import "react-data-grid/dist/react-data-grid.css";
import DataGrid, {
  Column,
  CellNavigationMode,
  ScrollPosition,
} from "react-data-grid";
import { DraggableHeader } from "react-data-grid-addons";

import Loading from "components/Loading";
import SubTableBreadcrumbs, { BREADCRUMBS_HEIGHT } from "./SubTableBreadcrumbs";
import TableHeader, { TABLE_HEADER_HEIGHT } from "./TableHeader";
import ColumnHeader from "./ColumnHeader";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn, { useFinalColumnStyles } from "./formatters/FinalColumn";

import { FireTableFilter } from "hooks/useFiretable";
import { useFiretableContext } from "contexts/firetableContext";

import { FieldType } from "constants/fields";
import { getFormatter } from "./formatters";
import { getEditor } from "./editors";

import useWindowSize from "hooks/useWindowSize";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { APP_BAR_HEIGHT } from "components/Navigation";
import useStyles from "./styles";

// const Hotkeys = lazy(() => import("./HotKeys"));
const ColumnEditor = lazy(() => import("./ColumnEditor/index"));
const { DraggableContainer } = DraggableHeader;

export type FiretableColumn = Column<any> & {
  isNew?: boolean;
  type: FieldType;
  [key: string]: any;
};

interface ITableProps {
  collection: string;
  filters: FireTableFilter[];
}

export default function Table({ collection, filters }: ITableProps) {
  const classes = useStyles();
  const theme = useTheme();
  const finalColumnClasses = useFinalColumnStyles();

  const {
    tableState,
    tableActions,
    updateCell,
    dataGridRef,
    sideDrawerRef,
  } = useFiretableContext();

  useEffect(() => {
    if (tableActions && tableState && tableState.tablePath !== collection) {
      console.log("setting table");
      tableActions.table.set(collection, filters);
      if (sideDrawerRef?.current) sideDrawerRef.current.setCell!(null);
    }
  }, [collection]);

  const rowsContainerRef = useRef<HTMLDivElement>(null);
  // Gets more rows when scrolled down.
  const [handleScroll] = useDebouncedCallback((position: ScrollPosition) => {
    const elem = rowsContainerRef?.current;
    const parent = elem?.parentNode as HTMLDivElement;
    if (!elem || !parent) return;

    const lowestScrollTopPosition = elem.scrollHeight - parent.clientHeight;
    const offset = 400;

    if (position.scrollTop < lowestScrollTopPosition - offset) return;

    // Prevent calling more rows when they’ve already been called
    if (tableState!.loadingRows) return;

    // Call for 30 more rows. Note we don’t know here if there are no more
    // rows left in the database. This is done in the useTable hook.
    tableActions?.row.more(30);
  }, 100);

  const windowSize = useWindowSize();
  if (!windowSize || !windowSize.height) return <></>;

  if (!tableActions || !tableState) return <></>;

  const onHeaderDrop = (dragged: any, target: any) => {
    tableActions.column.reorder(dragged, target);
  };

  let columns: FiretableColumn[] = [];
  if (!tableState.loadingColumns && tableState.columns) {
    columns = tableState.columns
      .filter((column: any) => !column.hidden)
      .map((column: any, index) => ({
        draggable: true,
        editable: true,
        resizable: true,
        frozen: column.fixed,
        headerRenderer: ColumnHeader,
        formatter: getFormatter(column),
        editor: getEditor(column),
        ...column,
        width: column.width ? (column.width > 380 ? 380 : column.width) : 150,
      }));
    columns.push({
      isNew: true,
      key: "new",
      name: "Add column",
      type: FieldType.last,
      width: 160,
      headerRenderer: FinalColumnHeader,
      cellClass: finalColumnClasses.cell,
      formatter: FinalColumn,
      editable: false,
    });
  }

  const rowHeight = tableState.config.rowHeight;

  const rows = tableState.rows;
  const rowGetter = (rowIdx: number) => rows[rowIdx];

  const inSubTable = collection.split("/").length > 1;

  let tableWidth: any = `calc(100% - ${
    DRAWER_COLLAPSED_WIDTH
    // sideDrawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH
  }px)`;
  if (windowSize.width < theme.breakpoints.values.md) tableWidth = "100%";

  return (
    <>
      {/* <Suspense fallback={<Loading message="Loading header" />}>
        <Hotkeys selectedCell={selectedCell} />
      </Suspense> */}

      {inSubTable && <SubTableBreadcrumbs collection={collection} />}

      <TableHeader
        collection={collection}
        rowHeight={rowHeight}
        updateConfig={tableActions.table.updateConfig}
        columns={columns}
        filters={filters}
      />

      {!tableState.loadingColumns ? (
        <DraggableContainer onHeaderDrop={onHeaderDrop}>
          <DataGrid
            columns={columns}
            rowGetter={rowGetter}
            rowsCount={rows.length}
            rowKey={"id" as "id"}
            onGridRowsUpdated={event => {
              console.log(event);
              const { action, cellKey, updated } = event;
              if (action === "CELL_UPDATE")
                updateCell!(rows[event.toRow].ref, cellKey as string, updated);
            }}
            rowHeight={rowHeight}
            headerRowHeight={44}
            // TODO: Investigate why setting a numeric value causes
            // LOADING to pop up on screen when scrolling horizontally
            // width={windowSize.width - DRAWER_COLLAPSED_WIDTH}
            minWidth={tableWidth}
            minHeight={
              windowSize.height -
              APP_BAR_HEIGHT * 2 -
              TABLE_HEADER_HEIGHT -
              (inSubTable ? BREADCRUMBS_HEIGHT : 0)
            }
            // enableCellCopyPaste
            // enableCellDragAndDrop
            onColumnResize={tableActions.column.resize}
            cellNavigationMode={CellNavigationMode.CHANGE_ROW}
            onCellSelected={({ rowIdx, idx: colIdx }) => {
              // Prevent selecting final row
              if (colIdx < columns.length - 1)
                sideDrawerRef?.current?.setCell!({
                  row: rowIdx,
                  column: columns[colIdx].key as string,
                });
            }}
            enableCellSelect
            onScroll={handleScroll}
            ref={dataGridRef}
            RowsContainer={props => (
              <>
                <div {...props} ref={rowsContainerRef} />
                <Grid
                  container
                  className={classes.loadingContainer}
                  alignItems="center"
                  justify="center"
                >
                  {tableState.rows.length > 0 && tableState.loadingRows && (
                    <CircularProgress disableShrink />
                  )}
                </Grid>
              </>
            )}
          />
        </DraggableContainer>
      ) : (
        <Loading message="Fetching columns" />
      )}

      <Suspense fallback={<Loading message="Loading helpers" />}>
        <ColumnEditor />
      </Suspense>
    </>
  );
}
