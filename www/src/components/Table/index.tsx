import React, { lazy, Suspense, useEffect, useRef } from "react";

import _orderBy from "lodash/orderBy";
import { useDebouncedCallback } from "use-debounce";
import _isEmpty from "lodash/isEmpty";

import { useTheme, Grid, CircularProgress } from "@material-ui/core";

import "react-data-grid/dist/react-data-grid.css";
import DataGrid, {
  Column,
  DataGridHandle,
  CellNavigationMode,
} from "react-data-grid";

import Loading from "components/Loading";
import TableHeader, { TABLE_HEADER_HEIGHT } from "./TableHeader";
import ColumnHeader from "./ColumnHeader";
import ColumnMenu from "./ColumnMenu";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn, { useFinalColumnStyles } from "./formatters/FinalColumn";

import { useFiretableContext } from "contexts/firetableContext";

import { FieldType } from "constants/fields";
import { getFormatter } from "./formatters";
import { getEditor } from "./editors";

import useWindowSize from "hooks/useWindowSize";
import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { APP_BAR_HEIGHT } from "components/Navigation";
import useStyles from "./styles";
import { useAppContext } from "contexts/appContext";
import _get from "lodash/get";
// const Hotkeys = lazy(() => import("./HotKeys" /* webpackChunkName: "HotKeys" */));

export type FiretableColumn = Column<any> & {
  isNew?: boolean;
  type: FieldType;
  [key: string]: any;
};

export default function Table() {
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
  const { userDoc } = useAppContext();
  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[`${tableState?.tablePath}`]?.hiddenFields ?? [];

  const rowsContainerRef = useRef<HTMLDivElement>(null);

  // Gets more rows when scrolled down.
  // https://github.com/adazzle/react-data-grid/blob/ead05032da79d7e2b86e37cdb9af27f2a4d80b90/stories/demos/AllFeatures.tsx#L60
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const offset = 800;
    const isAtBottom =
      target.clientHeight + target.scrollTop >= target.scrollHeight - offset;

    if (!isAtBottom) return;

    // Prevent calling more rows when they’ve already been called
    if (tableState!.loadingRows) return;

    // Call for 30 more rows. Note we don’t know here if there are no more
    // rows left in the database. This is done in the useTable hook.
    tableActions?.row.more(30);
  };

  const windowSize = useWindowSize();
  if (!windowSize || !windowSize.height) return <></>;

  if (!tableActions || !tableState) return <></>;

  const onHeaderDrop = (dragged: any, target: any) => {
    tableActions.column.reorder(dragged, target);
  };

  let columns: FiretableColumn[] = [];
  if (!tableState.loadingColumns && tableState.columns) {
    columns = _orderBy(
      Object.values(tableState.columns).filter(
        (column: any) => !column.hidden && column.key
      ),
      "index"
    )
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
      }))
      .filter((column) => !userDocHiddenFields.includes(column.key));
    columns.push({
      isNew: true,
      key: "new",
      name: "Add column",
      type: FieldType.last,
      index: columns.length ?? 0,
      width: 160,
      headerRenderer: FinalColumnHeader,
      cellClass: finalColumnClasses.cell,
      formatter: FinalColumn,
      editable: false,
    });
  }

  const rowHeight = tableState.config.rowHeight;
  const rows = tableState.rows.map((row) =>
    columns.reduce(
      (acc, currColumn) => ({
        ...acc,
        [currColumn.key]: _get(row, currColumn.key),
      }),
      { ref: row.ref, id: row.id }
    )
  );

  return (
    <>
      {/* <Suspense fallback={<Loading message="Loading header" />}>
        <Hotkeys selectedCell={selectedCell} />
      </Suspense> */}
      <div className={classes.wrapper} ref={rowsContainerRef}>
        <TableHeader
          rowHeight={rowHeight}
          updateConfig={tableActions.table.updateConfig}
        />

        {!tableState.loadingColumns ? (
          <DataGrid
            onColumnResize={tableActions.column.resize}
            onScroll={handleScroll}
            ref={dataGridRef}
            rows={rows}
            rowKey="id"
            columns={columns as any}
            rowHeight={rowHeight ?? 43}
            headerRowHeight={44}
            enableCellCopyPaste
            enableCellDragAndDrop
            cellNavigationMode={"LOOP_OVER_ROW"}
            // rowGetter={rowGetter}
            //rowsCount={rows.length}
            // onGridRowsUpdated={(event) => {
            //   const { action, cellKey, updated } = event;
            //   if (action === "CELL_UPDATE" && updated !== null)
            //     updateCell!(rows[event.toRow].ref, cellKey as string, updated);
            // }}

            // TODO: Investigate why setting a numeric value causes
            // LOADING to pop up on screen when scrolling horizontally
            // width={windowSize.width - DRAWER_COLLAPSED_WIDTH}
            // minWidth={tableWidth}
            // minHeight={windowSize.height - APP_BAR_HEIGHT - TABLE_HEADER_HEIGHT}
            // enableCellCopyPaste
            // enableCellDragAndDrop

            //cellNavigationMode={CellNavigationMode.CHANGE_ROW}
            // onCellSelected={({ rowIdx, idx: colIdx }) => {
            //   // Prevent selecting final row
            //   if (colIdx < columns.length - 1 && sideDrawerRef?.current)
            //     sideDrawerRef.current.setCell({
            //       row: rowIdx,
            //       column: columns[colIdx].key as string,
            //     });
            // }}
            //  enableCellSelect

            // RowsContainer={(props) => (
            //   <>
            //     <div {...props} ref={rowsContainerRef} />
            //     <Grid
            //       container
            //       className={classes.loadingContainer}
            //       alignItems="center"
            //       justify="center"
            //     >
            //       {tableState.rows.length > 0 && tableState.loadingRows && (
            //         <CircularProgress disableShrink />
            //       )}
            //     </Grid>
            //   </>
            // )}
          />
        ) : (
          <Loading message="Fetching columns" />
        )}
      </div>
      <ColumnMenu />
    </>
  );
}
