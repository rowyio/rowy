import React, { useState, useEffect } from "react";
import ReactDataGrid from "react-data-grid";
import useFiretable, { FireTableFilter } from "../../hooks/useFiretable";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { FieldType, getFieldIcon } from "../Fields";

import ColumnEditor from "./ColumnEditor/index";
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
import ImportCSV from "components/ImportCSV";
import SearchBox from "../SearchBox";
import DocSelect from "../Fields/DocSelect";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/AddCircle";
import SettingsIcon from "@material-ui/icons/Settings";

import useWindowSize from "../../hooks/useWindowSize";

const deleteAlgoliaRecord = functions.httpsCallable(
  CLOUD_FUNCTIONS.deleteAlgoliaRecord
);

const useStyles = makeStyles(Theme => {
  return createStyles({
    typography: {
      padding: 1,
    },
    header: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
      justifyContent: "space-between",
    },
    headerLabel: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
    },
    headerButton: {
      width: "100%",
    },
    tableHeader: {
      padding: 8,
      width: "100%",
      display: "flex",
      flex: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      // background: Theme.palette.primary.main,
    },
    tableActions: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
      // background: Theme.palette.primary.main,
    },
  });
});

interface Props {
  collection: string;
  filters: FireTableFilter[];
}

function Table(props: Props) {
  const { collection, filters } = props;
  console.log(filters);
  const { tableState, tableActions } = useFiretable(collection);
  const [search, setSearch] = useState({
    config: undefined,
    collection: "",
    onSubmit: undefined,
  });

  const size = useWindowSize();

  useEffect(() => {
    tableActions.set(collection, filters);
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
    <DocSelect
      {...props}
      onSubmit={onSubmit(column.key, props.row)}
      collectionPath={column.collectionPath}
      config={column.config}
      setSearch={setSearch}
    />
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
            <Button
              onClick={handleClick(props)}
              style={{ width: column.width }}
            >
              {column.name} <AddIcon />
            </Button>
          </div>
        );
      default:
        return (
          <div className={classes.header}>
            {/* <Button
              style={{ width: column.width }}
              className={classes.headerButton}
              onClick={handleClick(props)}
              aria-label="edit"
            > */}
            <div className={classes.headerLabel}>
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
            {/* <EditIcon /> */}
            {/* </Button> */}
          </div>
        );
    }
  };

  if (tableState.columns) {
    let columns = tableState.columns.map((column: any) => ({
      width: 220,
      editable: editable(column.type),
      resizable: true,
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
    }));
    columns.push({
      isNew: true,
      key: "new",
      name: "Add column",
      width: 160,
      headerRenderer: headerRenderer,
      formatter: (props: any) => (
        <Button
          onClick={async () => {
            props.row.ref.delete();
            await deleteAlgoliaRecord({
              id: props.row.ref.id,
              collection: props.row.ref.parent.path,
            });
          }}
        >
          Delete row
        </Button>
      ),
    });
    const rows = tableState.rows;

    return (
      <>
        <div className={classes.tableHeader}>
          <Typography variant="button">{collection}</Typography>
          <div className={classes.tableActions}>
            <ImportCSV
              columns={tableState.columns}
              addRow={tableActions.row.add}
            />
            <Button
              color="secondary"
              onClick={() => {
                tableActions.row.add();
              }}
            >
              Add Row
              <AddIcon />
            </Button>
          </div>
        </div>
        <ReactDataGrid
          rowHeight={40}
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          onGridRowsUpdated={onGridRowsUpdated}
          enableCellSelect={true}
          minHeight={size.height ? size.height - 102 : 100}
          onCellSelected={onCellSelected}
          onColumnResize={(idx, width) =>
            tableActions.column.resize(idx, width)
          }
          emptyRowsView={() => {
            return (
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#ddd",
                  padding: "100px",
                }}
              >
                <h3>no data to show</h3>
                <Button
                  onClick={() => {
                    tableActions.row.add();
                  }}
                >
                  Add Row
                </Button>
              </div>
            );
          }}
        />

        <ColumnEditor
          handleClose={handleCloseHeader}
          anchorEl={anchorEl}
          column={header && header.column}
          actions={tableActions.column}
        />
        <SearchBox searchData={search} clearSearch={clearSearch} />
      </>
    );
  } else return <p>Loading</p>;
}

export default Table;
