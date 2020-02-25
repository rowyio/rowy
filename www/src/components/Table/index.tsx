import React, { useState, useEffect, lazy, Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";
import _isEmpty from "lodash/isEmpty";

import "react-data-grid/dist/react-data-grid.css";
import DataGrid, {
  Column,
  CellNavigationMode,
  ScrollPosition,
} from "react-data-grid";

import { makeStyles, createStyles, fade, Button } from "@material-ui/core";

import Loading from "components/Loading";
import TableHeader from "./TableHeader";
import ColumnHeader from "./ColumnHeader";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn, { useFinalColumnStyles } from "./formatters/FinalColumn";

import { FireTableFilter } from "hooks/useFiretable";
import { useFiretableContext } from "contexts/firetableContext";

import { FieldType } from "constants/fields";
import { getFormatter } from "./formatters";
import { getEditor } from "./editors";
import { EditorProvider } from "../../util/EditorProvider";

import useWindowSize from "hooks/useWindowSize";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";

const Hotkeys = lazy(() => import("./HotKeys"));
const ColumnEditor = lazy(() => import("./ColumnEditor/index"));

export type FiretableColumn = Column<any> & {
  isNew?: boolean;
  type: FieldType;
  [key: string]: any;
};

interface Props {
  collection: string;
  filters: FireTableFilter[];
}

const useStyles = makeStyles(theme =>
  createStyles({
    "@global": {
      ".rdg-root": {
        "&.rdg-root": {
          borderColor: "#e0e0e0",
          lineHeight: "inherit !important",
        },

        "& .rdg-header": { backgroundColor: theme.palette.background.default },

        "& .rdg-cell": {
          borderColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(0, 1.5),
        },
      },

      ".rdg-viewport, .rdg-editor-container": {
        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: "inherit",
        color: theme.palette.text.secondary,
      },

      ".rdg-row:hover": { color: theme.palette.text.primary },

      ".row-hover-iconButton": {
        color: theme.palette.text.disabled,

        ".rdg-row:hover &": {
          color: theme.palette.text.primary,
          backgroundColor: fade(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity * 2
          ),
        },
      },

      ".cell-collapse-padding": {
        margin: theme.spacing(0, -1.5),
        width: `calc(100% + ${theme.spacing(3)}px)`,
      },
    },
  })
);

function Table(props: Props) {
  useStyles();
  const finalColumnClasses = useFinalColumnStyles();

  const { collection, filters } = props;
  const {
    tableState,
    tableActions,
    selectedCell,
    setSelectedCell,
    updateCell,
    sideDrawerOpen,
    dataGridRef,
  } = useFiretableContext();

  useEffect(() => {
    if (tableActions && tableState && tableState.tablePath !== collection) {
      console.log("setting table");
      tableActions.table.set(collection, filters);
      setSelectedCell!({});
    }
  }, [collection]);

  const [handleScroll] = useDebouncedCallback(
    (position: ScrollPosition) => console.log(position),
    100
  );

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
        // frozen: column.fixed,
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
      headerCellClass: finalColumnClasses.headerCell,
      cellClass: finalColumnClasses.cell,
      formatter: FinalColumn,
    });
  }

  const rowHeight = tableState.config.rowHeight;

  const rows =
    tableState.rows.length !== 0
      ? [...tableState.rows.map((row: any) => ({ rowHeight, ...row })), {}]
      : [];

  const RowRenderer = (props: any) => {
    const { renderBaseRow, ...rest } = props;
    if (rows.length === rest.idx + 1) {
      return (
        <Button
          onClick={() => {
            addRow();
          }}
        >
          Add a new row
        </Button>
      );
    } else {
      return renderBaseRow(rest);
    }
  };

  const addRow = (data?: any) => {
    if (filters) {
      // adds filter data into the new row
      const filtersData = filters.reduce(
        (accumulator: any, currentValue: FireTableFilter) => ({
          ...accumulator,
          [currentValue.key]: currentValue.value,
        }),
        {}
      );
      tableActions.row.add({ ...filtersData, ...data });
    } else tableActions.row.add({ ...data });
  };

  return (
    <EditorProvider>
      <Suspense fallback={<Loading message="Loading header" />}>
        <Hotkeys selectedCell={selectedCell} />
      </Suspense>

      <TableHeader
        collection={collection}
        rowHeight={rowHeight}
        updateConfig={tableActions.table.updateConfig}
        columns={columns}
        filters={filters}
      />

      {!tableState.loadingColumns ? (
        <DataGrid
          columns={columns}
          rows={rows}
          rowKey={"id" as "id"}
          onRowsUpdate={event => {
            console.log(event);
            const { action, cellKey, updated } = event;
            if (action === "CELL_UPDATE")
              updateCell!(rows[event.toRow].ref, cellKey, updated);
          }}
          rowHeight={rowHeight}
          headerRowHeight={43}
          // TODO: Investigate why setting a numeric value causes
          // LOADING to pop up on screen when scrolling horizontally
          // width={windowSize.width - DRAWER_COLLAPSED_WIDTH}
          width={
            `calc(100% - ${
              sideDrawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH
            }px)` as any
          }
          height={windowSize.height - 120}
          enableCellCopyPaste
          enableCellDragAndDrop
          onColumnResize={tableActions.column.resize}
          cellNavigationMode={CellNavigationMode.CHANGE_ROW}
          onSelectedCellChange={({ rowIdx, idx: colIdx }) =>
            setSelectedCell!({ row: rowIdx, column: columns[colIdx].key })
          }
          onScroll={handleScroll}
          ref={dataGridRef}
        />
      ) : (
        <Loading message="Fetching columns" />
      )}

      <Suspense fallback={<Loading message="Loading helpers" />}>
        <ColumnEditor />
      </Suspense>
    </EditorProvider>
  );
}
export default Table;
