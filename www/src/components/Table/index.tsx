import React, { useState, useEffect, lazy, Suspense } from "react";
import _isEmpty from "lodash/isEmpty";

import { makeStyles, createStyles, fade, Button } from "@material-ui/core";

import useWindowSize from "hooks/useWindowSize";

import Loading from "components/Loading";
import Grid, { IGridProps } from "./Grid";
import ColumnHeader from "./ColumnHeader";
import FinalColumnHeader from "./FinalColumnHeader";

import { FireTableFilter, FiretableOrderBy } from "hooks/useFiretable";
import { useAppContext } from "contexts/appContext";
import { useFiretableContext } from "contexts/firetableContext";

import { FieldType } from "constants/fields";
import { getFormatter, getEditor } from "./grid-fns";
import { EditorProvider } from "../../util/EditorProvider";

import FinalColumn, { useFinalColumnStyles } from "./formatters/FinalColumn";

const Hotkeys = lazy(() => import("./HotKeys"));
const TableHeader = lazy(() => import("./TableHeader"));
const SearchBox = lazy(() => import("../SearchBox"));
const DocSelect = lazy(() => import("../Fields/DocSelect"));
const ColumnEditor = lazy(() => import("./ColumnEditor/index"));

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
  const { currentUser } = useAppContext();
  const {
    tableState,
    tableActions,
    setSelectedCell: contextSetSelectedCell,
  } = useFiretableContext();
  const [orderBy, setOrderBy] = useState<FiretableOrderBy>([]);

  useEffect(() => {
    if (tableActions && tableState && tableState.tablePath !== collection) {
      console.log("setting table");
      tableActions.table.set(collection, filters);
      if (contextSetSelectedCell) contextSetSelectedCell({});
    }
  }, [collection]);
  // TODO: move this to firetableContext
  const [selectedCell, setSelectedCell] = useState<{ row: any; column: any }>({
    row: {},
    column: {},
  });

  const [search, setSearch] = useState({
    config: undefined,
    collection: "",
    onSubmit: undefined,
  });

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [header, setHeader] = useState<any | null>();

  const windowSize = useWindowSize();
  if (!windowSize || !windowSize.height) return <></>;

  if (!tableActions || !tableState) return <></>;
  const handleCloseHeader = () => {
    setHeader(null);
    setAnchorEl(null);
  };
  const clearSearch = () => {
    setSearch({
      config: undefined,
      collection: "",
      onSubmit: undefined,
    });
  };

  const onHeaderDrop = (dragged: any, target: any) => {
    tableActions.column.reorder(dragged, target);
  };

  let columns: IGridProps["columns"] = [];
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
      editable: false,
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
  /**
   * Intercepting row getter to detect when table is requesting the last local row the bottom and fetch more rows
   * @param index
   */
  const handleRowGetter = (index: number) => {
    if (tableState.queryLimit - index < 30) {
      tableActions.row.more(30);
    }
    return rows[index];
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
        <TableHeader
          collection={collection}
          rowHeight={rowHeight}
          updateConfig={tableActions.table.updateConfig}
          columns={columns}
          filters={filters}
        />
      </Suspense>

      {!tableState.loadingColumns ? (
        <Grid
          key={`${collection}-grid`}
          onHeaderDrop={onHeaderDrop}
          rowHeight={rowHeight}
          columns={columns}
          RowRenderer={RowRenderer}
          handleRowGetter={handleRowGetter}
          // TODO: Remove this fixed height using flexbox
          tableHeight={windowSize.height - 120}
          tableWidth={"100%"}
          rows={rows}
          resizeColumn={tableActions.column.resize}
          loadingRows={tableState.loadingRows}
          addRow={addRow}
          setSelectedCell={setSelectedCell}
        />
      ) : (
        <Loading message="Fetching columns" />
      )}

      <Suspense fallback={<Loading message="Loading helpers" />}>
        <ColumnEditor />
        <SearchBox searchData={search} clearSearch={clearSearch} />
      </Suspense>
    </EditorProvider>
  );
}
export default Table;
