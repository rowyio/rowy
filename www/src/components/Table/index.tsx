import React, { useState, useEffect, lazy, Suspense } from "react";

import useFiretable, { FireTableFilter } from "../../hooks/useFiretable";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { FieldType, getFieldIcon } from "../Fields";
import { functions } from "../../firebase";
import {
  cellFormatter,
  onCellSelected,
  onGridRowsUpdated,
  singleSelectEditor,
  editable,
  onSubmit,
} from "./grid-fns";
import { CLOUD_FUNCTIONS } from "firebase/callables";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/AddCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import useWindowSize from "../../hooks/useWindowSize";
import Confirmation from "components/Confirmation";
import DeleteIcon from "@material-ui/icons/Delete";
import DuplicateIcon from "@material-ui/icons/FileCopy";
import useStyles from "./useStyle";
import Grid from "./Grid";
import Tooltip from "@material-ui/core/Tooltip";
import { EditorProvider } from "../../util/EditorProvider";
import LongTextEditor from "../LongTextEditor";

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
  const { tableState, tableActions } = useFiretable(collection, filters);
  const [selectedCell, setSelectedCell] = useState<{ row: any; column: any }>({
    row: {},
    column: {},
  });
  const [search, setSearch] = useState({
    config: undefined,
    collection: "",
    onSubmit: undefined,
  });

  const size = useWindowSize();

  useEffect(() => {
    tableActions.table.set(collection, filters);
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
            <div className={classes.header}>
              <div
                className={classes.headerLabel}
                onClick={() => {
                  navigator.clipboard.writeText(props.column.key);
                }}
              >
                {getFieldIcon(props.column.type)}
                <Typography variant="button">{props.column.name}</Typography>
              </div>
              <IconButton
                disableFocusRipple={true}
                size="small"
                onClick={handleClick(props)}
              >
                <SettingsIcon />
              </IconButton>
            </div>
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
              title: "Delete  Row",
              body: "Are you sure you want to delete this row",
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

  const tableHeight = size.height ? size.height - 142 : 500;
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
      <Suspense fallback={<div>Loading header...</div>}>
        <Hotkeys selectedCell={selectedCell} />
        <TableHeader
          collection={collection}
          rowHeight={rowHeight}
          updateConfig={tableActions.table.updateConfig}
          columns={columns}
          filters={filters}
          addRow={addRow}
        />
      </Suspense>{" "}
      {!tableState.loadingColumns ? (
        <Grid
          key={`${collection}-grid`}
          onHeaderDrop={onHeaderDrop}
          rowHeight={rowHeight}
          columns={columns}
          RowRenderer={RowRenderer}
          handleRowGetter={handleRowGetter}
          tableHeight={tableHeight}
          onGridRowsUpdated={onGridRowsUpdated}
          rows={rows}
          resizeColumn={tableActions.column.resize}
          loadingRows={tableState.loadingRows}
          addRow={addRow}
          setSelectedCell={setSelectedCell}
        />
      ) : (
        <p>fetching columns</p>
      )}
      <Suspense fallback={<div>Loading helpers...</div>}>
        <ColumnEditor
          handleClose={handleCloseHeader}
          anchorEl={anchorEl}
          column={header && header.column}
          actions={tableActions.column}
        />

        <SearchBox searchData={search} clearSearch={clearSearch} />
        <LongTextEditor />
      </Suspense>
    </EditorProvider>
  );
}
export default Table;
