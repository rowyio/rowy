import React, { useState, useEffect } from "react";
import ReactDataGrid from "react-data-grid";
import useFiretable from "../../hooks/useFiretable";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import { FieldType, getFieldIcon } from "../Fields";

import ColumnEditor from "./ColumnEditor/index";

import {
  cellFormatter,
  onCellSelected,
  onGridRowsUpdated,
  singleSelectEditor,
  editable,
} from "./grid-fns";
const useStyles = makeStyles(Theme =>
  createStyles({
    typography: {
      padding: 1,
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0,
    },
    headerButton: {
      width: "100%",
    },
  })
);

function Table(props: any) {
  const { collection } = props;
  const { tableState, tableActions } = useFiretable(collection);
  useEffect(() => {
    tableActions.set(collection);
  }, [collection]);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [header, setHeader] = useState<any | null>();

  const handleCloseHeader = () => {
    setHeader(null);
    setAnchorEl(null);
  };
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
              {column.name}
            </Button>
          </div>
        );
      default:
        return (
          <div className={classes.header}>
            <Button
              style={{ width: column.width }}
              className={classes.headerButton}
              onClick={handleClick(props)}
              aria-label="edit"
            >
              {getFieldIcon(props.column.type)}
              {props.column.name}
              {/* <EditIcon /> */}
            </Button>
          </div>
        );
    }
  };

  if (tableState.columns) {
    let columns = tableState.columns.map((column: any) => ({
      width: 220,
      key: column.fieldName,
      name: column.columnName,
      editable: editable(column.type),
      resizable: true,
      headerRenderer: headerRenderer,
      formatter: cellFormatter(column.type, column.key),
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
    });
    const rows = tableState.rows; //.map((row: any) => ({ height: 100, ...row }));
    return (
      <>
        <ReactDataGrid
          rowHeight={60}
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          onGridRowsUpdated={onGridRowsUpdated}
          enableCellSelect={true}
          minHeight={500}
          onCellSelected={onCellSelected}
          onColumnResize={(idx, width) =>
            tableActions.column.resize(idx, width)
          }
        />
        <Button onClick={tableActions.row.add}>Add Row</Button>
        <ColumnEditor
          handleClose={handleCloseHeader}
          anchorEl={anchorEl}
          column={header && header.column}
          actions={tableActions.column}
        />
      </>
    );
  } else return <p>Loading</p>;
}

export default Table;
