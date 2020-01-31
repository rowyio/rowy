import React, { useState, useEffect, lazy, Suspense } from "react";
import _isEmpty from "lodash/isEmpty";

import {
  Button,
  IconButton,
  Typography,
  Grid as MuiGrid,
  Tooltip,
} from "@material-ui/core";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import SettingsIcon from "@material-ui/icons/Settings";
import Confirmation from "components/Confirmation";
import DeleteIcon from "@material-ui/icons/Delete";
import DuplicateIcon from "@material-ui/icons/FileCopy";
import AddIcon from "@material-ui/icons/AddCircle";

import useStyles from "./useStyle";

import Loading from "../../components/Loading";
import Grid from "./Grid";
import LongTextEditor from "../LongTextEditor";
import RichTextEditor from "../RichTextEditor";

import useFiretable, {
  FireTableFilter,
  FiretableOrderBy,
} from "../../hooks/useFiretable";
import { functions } from "../../firebase";
import { CLOUD_FUNCTIONS } from "firebase/callables";

import { FieldType, getFieldIcon } from "../Fields";
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

const deleteAlgoliaRecord = functions.httpsCallable(
  CLOUD_FUNCTIONS.deleteAlgoliaRecord
);

interface Props {
  collection: string;
  filters: FireTableFilter[];
}

function Table(props: Props) {
  const { collection, filters } = props;
  const [orderBy, setOrderBy] = useState<FiretableOrderBy>([]);
  const { tableState, tableActions } = useFiretable(
    collection,
    filters,
    orderBy
  );
  const [selectedCell, setSelectedCell] = useState<{ row: any; column: any }>({
    row: {},
    column: {},
  });

  const [search, setSearch] = useState({
    config: undefined,
    collection: "",
    onSubmit: undefined,
  });

  useEffect(() => {
    tableActions.table.set(collection, filters, orderBy);
  }, [collection, filters]);

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [header, setHeader] = useState<any | null>();

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
        onSubmit={onSubmit(column.key, props.row)}
        collectionPath={column.collectionPath}
        config={column.config}
        setSearch={setSearch}
      />
    </Suspense>
  );
  const handleClick = (headerProps: any) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleCloseHeader();
    setAnchorEl(event.currentTarget);
    setHeader(headerProps);
  };

  const headerRenderer = (props: any) => {
    const { column } = props;
    switch (column.key) {
      case "new":
        return (
          <div className={classes.header}>
            {column.name}
            <IconButton size="small" onClick={handleClick(props)}>
              <AddIcon />
            </IconButton>
          </div>
        );
      default:
        return (
          <Tooltip title={props.column.key}>
            <MuiGrid
              container
              className={classes.header}
              alignItems="center"
              wrap="nowrap"
            >
              <MuiGrid
                item
                onClick={() => {
                  navigator.clipboard.writeText(props.column.key);
                }}
                className={classes.columnIconContainer}
              >
                {getFieldIcon(props.column.type)}
              </MuiGrid>
              <MuiGrid
                item
                xs
                onClick={() => {
                  navigator.clipboard.writeText(props.column.key);
                }}
                className={classes.columnNameContainer}
              >
                <Typography
                  variant="h6"
                  noWrap
                  className={classes.columnName}
                  component="span"
                >
                  {props.column.name}
                </Typography>
              </MuiGrid>

              <MuiGrid item>
                <IconButton
                  color={
                    orderBy[0] && orderBy[0].key === column.key
                      ? "primary"
                      : "default"
                  }
                  disableFocusRipple={true}
                  size="small"
                  onClick={() => {
                    console.log(
                      orderBy,
                      orderBy[0] && orderBy[0].key === column.key,
                      orderBy[0] && orderBy[0].direction === "asc"
                    );
                    if (
                      orderBy[0] &&
                      orderBy[0].key === column.key &&
                      orderBy[0].direction === "asc"
                    ) {
                      const ordering: FiretableOrderBy = [
                        { key: column.key, direction: "desc" },
                      ];

                      tableActions.table.orderBy(ordering);
                      //setOrderBy(ordering) #BROKENINSIDE
                    } else {
                      const ordering: FiretableOrderBy = [
                        { key: column.key, direction: "asc" },
                      ];
                      tableActions.table.orderBy(ordering);
                      //setOrderBy(ordering) #BROKENINSIDE
                    }
                  }}
                >
                  <ImportExportIcon />
                </IconButton>
                <IconButton
                  disableFocusRipple={true}
                  size="small"
                  onClick={handleClick(props)}
                >
                  <SettingsIcon />
                </IconButton>
              </MuiGrid>
            </MuiGrid>
          </Tooltip>
        );
    }
  };

  const onHeaderDrop = (dragged: any, target: any) => {
    tableActions.column.reorder(dragged, target);
  };
  let columns: any[] = [];
  if (!tableState.loadingColumns && tableState.columns) {
    columns = tableState.columns
      .filter((column: any) => !column.hidden)
      .map((column: any) => ({
        draggable: true,
        editable: editable(column.type),
        resizable: true,
        //frozen: column.fixed,
        headerRenderer: headerRenderer,
        formatter:
          column.type === FieldType.documentSelect
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
      headerRenderer: headerRenderer,
      formatter: (props: any) => (
        <>
          <Confirmation
            message={{
              title: "Delete Row",
              body: "Are you sure you want to delete this row?",
              confirm: (
                <>
                  <DeleteIcon /> Delete
                </>
              ),
            }}
          >
            <IconButton
              color="primary"
              onClick={async () => {
                props.row.ref.delete();
                await deleteAlgoliaRecord({
                  id: props.row.ref.id,
                  collection: props.row.ref.parent.path,
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Confirmation>
          <IconButton
            color="secondary"
            onClick={() => {
              const clonedRow = { ...props.row };
              // remove metadata
              delete clonedRow.ref;
              delete clonedRow.rowHeight;
              delete clonedRow.updatedAt;
              delete clonedRow.createdAt;
              tableActions.row.add(clonedRow);
            }}
          >
            <DuplicateIcon />
          </IconButton>
        </>
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
    if (tableState.rowsLimit - index === 1) {
      tableActions.row.more();
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
          tableActions={tableActions}
          collection={collection}
          rowHeight={rowHeight}
          updateConfig={tableActions.table.updateConfig}
          columns={columns}
          filters={filters}
          addRow={addRow}
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
          tableHeight="calc(100vh - 120px)"
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
        <ColumnEditor
          handleClose={handleCloseHeader}
          anchorEl={anchorEl}
          column={header && header.column}
          actions={tableActions.column}
        />

        <SearchBox searchData={search} clearSearch={clearSearch} />
        <RichTextEditor />
        <LongTextEditor />
      </Suspense>
    </EditorProvider>
  );
}
export default Table;
