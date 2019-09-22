import React, { useState } from "react";
import ReactDataGrid from "react-data-grid";

import useFiretable from "../../hooks/useFiretable";
import Typography from "@material-ui/core/Typography";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import HeaderPopper from "./HeaderPopper";
import { FieldType } from "../Fields";

import Date from "../Fields/Date";
import Rating from "../Fields/Rating";
import CheckBox from "../Fields/CheckBox";
import UrlLink from "../Fields/UrlLink";
const useStyles = makeStyles(Theme =>
  createStyles({
    typography: {
      padding: 1
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0
    },
    headerButton: {
      width: "100%"
    }
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
const onSubmit = (fieldName: string) => (
  ref: firebase.firestore.DocumentReference,
  value: any
) => {
  if (value !== null || value !== undefined) {
    ref.update({ [fieldName]: value });
  }
};

const DateFormatter = (fieldName: string, fieldType: FieldType) => (
  props: any
) => {
  return (
    <Date {...props} onSubmit={onSubmit(fieldName)} fieldType={fieldType} />
  );
};

const formatter = (fieldType: FieldType, fieldName: string) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
      return DateFormatter(fieldName, fieldType);
    case FieldType.rating:
      return (props: any) => {
        return <Rating {...props} onSubmit={onSubmit(fieldName)} />;
      };
    case FieldType.checkBox:
      return (props: any) => {
        return <CheckBox {...props} onSubmit={onSubmit(fieldName)} />;
      };
    case FieldType.url:
      return (props: any) => {
        return <UrlLink {...props} onSubmit={onSubmit(fieldName)} />;
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
    handleCloseHeader();
    console.log(args);
  };
  const headerRenderer = (props: any) => {
    switch (props.column.key) {
      case "new":
        return (
          <Button onClick={handleClick(props)} className={classes.header}>
            {props.column.name}
          </Button>
        );
      default:
        return (
          <div className={classes.header}>
            <Button
              className={classes.headerButton}
              onClick={handleClick(props)}
              aria-label="edit"
            >
              {props.column.name} <EditIcon />
            </Button>
          </div>
        );
    }
  };

  if (tableState.columns) {
    let columns = tableState.columns.map((column: any) => ({
      key: column.fieldName,
      name: column.columnName,
      editable: editable(column.type),
      resizeable: true,
      //  frozen: column.fieldName === "cohort",
      headerRenderer: headerRenderer,
      formatter: formatter(column.type, column.fieldName),
      width: 200,
      ...column
    }));
    columns.push({
      key: "new",
      name: "Add column",
      width: 160,
      headerRenderer: headerRenderer
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
        />
        <Button onClick={tableActions.row.add}>Add Row</Button>
        <HeaderPopper
          handleClose={handleCloseHeader}
          anchorEl={anchorEl}
          column={header && header.column}
        />
      </>
    );
  } else return <p>Loading</p>;
}

export default Table;
