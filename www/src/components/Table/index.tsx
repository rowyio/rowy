import React, { useState, useEffect, lazy, Suspense } from "react";
import _isEmpty from "lodash/isEmpty";

import {
  makeStyles,
  createStyles,
  Button,
  Grid as MuiGrid,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Confirmation from "components/Confirmation";
import CopyCellsIcon from "assets/icons/CopyCells";
import DeleteIcon from "@material-ui/icons/Cancel";

import useWindowSize from "hooks/useWindowSize";

import Loading from "components/Loading";
import Grid, { IGridProps } from "./Grid";
import ColumnHeader from "./ColumnHeader";

import { FireTableFilter, FiretableOrderBy } from "hooks/useFiretable";
import { useAppContext } from "contexts/appContext";
import { useFiretableContext } from "contexts/firetableContext";

import { FieldType, getFieldIcon } from "constants/fields";
import {
  cellFormatter,
  onCellSelected,
  onGridRowsUpdated,
  singleSelectEditor,
  editable,
  onSubmit,
} from "./grid-fns";
import { EditorProvider } from "../../util/EditorProvider";

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

      ".rdg-viewport": {
        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: "inherit",
        color: theme.palette.text.secondary,
      },
    },

    finalHeaderCell: {
      ".rdg-root &": {
        width: "40px !important",
        overflow: "visible",

        "& > div": {
          position: "absolute",
          right: "-50%",
        },
      },
    },

    finalCell: {
      ".rdg-root &": {
        background: theme.palette.background.default,
        borderColor: "transparent",
      },
    },
  })
);

function Table(props: Props) {
  const classes = useStyles();

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
  const docSelect = (column: any) => (props: any) => (
    <Suspense fallback={<div />}>
      <DocSelect
        {...props}
        onSubmit={onSubmit(column.key, props.row, currentUser?.uid)}
        collectionPath={column.collectionPath}
        config={column.config}
        setSearch={setSearch}
      />
    </Suspense>
  );

  const onHeaderDrop = (dragged: any, target: any) => {
    tableActions.column.reorder(dragged, target);
  };

  let columns: IGridProps["columns"] = [];
  if (!tableState.loadingColumns && tableState.columns) {
    columns = tableState.columns
      .filter((column: any) => !column.hidden)
      .map((column: any) => ({
        draggable: true,
        editable: true,
        resizable: true,
        //frozen: column.fixed,
        headerRenderer: ColumnHeader,
        formatter:
          column.type === FieldType.connectTable
            ? docSelect(column)
            : cellFormatter(column),
        editor:
          column.type === FieldType.singleSelect
            ? singleSelectEditor(column.options)
            : false,
        ...column,
        width: column.width ? (column.width > 380 ? 380 : column.width) : 150,
      }));
    columns.push({
      isNew: true,
      key: "new",
      name: "Add column",
      type: FieldType.last,
      width: 160,
      headerRenderer: ColumnHeader,
      headerCellClass: classes.finalHeaderCell,
      cellClass: classes.finalCell,
      formatter: (props: any) => (
        <MuiGrid container spacing={1}>
          <MuiGrid item>
            <Tooltip title="Duplicate row">
              <IconButton
                size="small"
                onClick={() => {
                  const clonedRow = { ...props.row };
                  // remove metadata
                  delete clonedRow.ref;
                  delete clonedRow.rowHeight;
                  delete clonedRow.updatedAt;
                  delete clonedRow.createdAt;
                  tableActions.row.add(clonedRow);
                }}
                aria-label="Duplicate row"
              >
                <CopyCellsIcon />
              </IconButton>
            </Tooltip>
          </MuiGrid>

          <MuiGrid item>
            <Tooltip title="Delete row">
              <span>
                <Confirmation
                  message={{
                    title: "Delete Row",
                    body: "Are you sure you want to delete this row?",
                    confirm: "Delete",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={async () => {
                      props.row.ref.delete();
                    }}
                    aria-label="Delete row"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Confirmation>
              </span>
            </Tooltip>
          </MuiGrid>
        </MuiGrid>
      ),
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
    if (tableState.rowsLimit - index < 30) {
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
          onGridRowsUpdated={onGridRowsUpdated}
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
