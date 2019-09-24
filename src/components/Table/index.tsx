import React, { useState } from "react";
import ReactDataGrid from "react-data-grid";

import useFiretable from "../../hooks/useFiretable";
import Typography from "@material-ui/core/Typography";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import HeaderPopper from "./HeaderPopper";
import { FieldType, getFieldIcon } from "../Fields";

import Date from "../Fields/Date";
import Rating from "../Fields/Rating";
import CheckBox from "../Fields/CheckBox";
import UrlLink from "../Fields/UrlLink";

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

const copyPaste = (props: any) => {
  console.log(props);
};
const editable = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.rating:
    case FieldType.checkBox:
      return false;

    default:
      return true;
  }
};
const onSubmit = (key: string) => (
  ref: firebase.firestore.DocumentReference,
  value: any
) => {
  if (value !== null || value !== undefined) {
    ref.update({ [key]: value });
  }
};

const DateFormatter = (key: string, fieldType: FieldType) => (props: any) => {
  return <Date {...props} onSubmit={onSubmit(key)} fieldType={fieldType} />;
};

const formatter = (fieldType: FieldType, key: string) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
      return DateFormatter(key, fieldType);
    case FieldType.rating:
      return (props: any) => {
        return (
          <Rating
            {...props}
            onSubmit={onSubmit(key)}
            value={typeof props.value === "number" ? props.value : 0}
          />
        );
      };
    case FieldType.checkBox:
      return (props: any) => {
        return <CheckBox {...props} onSubmit={onSubmit(key)} />;
      };
    case FieldType.url:
      return (props: any) => {
        return <UrlLink {...props} onSubmit={onSubmit(key)} />;
      };
    default:
      return false;
  }
};

function Table(props: any) {
  const { collection } = props;
  const { tableState, tableActions } = useFiretable(collection);

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

  const onGridRowsUpdated = (props: any) => {
    const { fromRowData, updated } = props;
    fromRowData.ref.update(updated);
  };
  const onCellSelected = (args: any) => {
    // handleCloseHeader();
    console.log(args);
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
      formatter: formatter(column.type, column.fieldName),
      ...column,
    }));
    columns.push({
      isNew: true,
      key: "new",
      name: "Add column",
      width: 160,
      headerRenderer: headerRenderer,
    });
    const rows = tableState.rows;
    return (
      <>
        <ReactDataGrid
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          onGridRowsUpdated={onGridRowsUpdated}
          enableCellSelect={true}
          onCellCopyPaste={copyPaste}
          minHeight={500}
          onCellSelected={onCellSelected}
          onColumnResize={(idx, width) =>
            tableActions.column.resize(idx, width)
          }
        />
        <Button onClick={tableActions.row.add}>Add Row</Button>
        <HeaderPopper
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
