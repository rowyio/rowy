import React, { useState } from "react";
import { TableCell as MuiTableCell, Switch } from "@material-ui/core";
import clsx from "clsx";
import { FieldType } from "../Fields";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/AddCircle";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

import TextField from "@material-ui/core/TextField";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
const TableCell = (props: any) => {
  const {
    fieldType,
    rowIndex,
    rowData,
    columnData,
    classes,
    cellActions,
    cellData,
    onRowClick,
    rowHeight,
    columnIndex,
    columns,
    focusedCell
  } = props;
  const [state, setState] = useState(cellData);
  const inputRenderer = () => {
    switch (fieldType) {
      case FieldType.checkBox:
        return (
          <Checkbox
            checked={state}
            onChange={e => {
              setState(!state);
              cellActions.update(!state);
            }}
          />
        );
      case FieldType.number:
        return (
          <TextField
            id="number"
            defaultValue={cellData}
            onChange={e => {
              cellActions.update(e.target.value);
            }}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
          />
        );
      case FieldType.date:
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoFocus
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              value={new Date("2014-08-18T21:11:54")}
              onChange={date => {
                console.log(date);
                //cellActions.update(e.target.value);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        );

      case FieldType.rating:
        return <Rating name="pristine" value={null} />;
      default:
        return (
          <TextField
            autoFocus
            defaultValue={cellData}
            onChange={e => {
              cellActions.update(e.target.value);
            }}
          />
        );
    }
  };
  const valueRenderer = () => {
    switch (fieldType) {
      case FieldType.checkBox:
        return cellData === true ? <CheckBoxIcon /> : <CheckBoxOutlineIcon />;

      default:
        return cellData;
        break;
    }
  };
  if (fieldType === "DELETE")
    return (
      <IconButton
        aria-label="delete"
        onClick={() => {
          columnData.actions.deleteRow(rowIndex, rowData.id);
        }}
      >
        <DeleteIcon />
      </IconButton>
    );

  return (
    <MuiTableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, {
        [classes.noClick]: onRowClick == null
      })}
      variant="body"
      onClick={() => {
        cellActions.set({
          rowIndex,
          docId: rowData.id,
          fieldName: columnData.fieldName,
          value: cellData
        });
      }}
      style={{ height: rowHeight }}
      align={
        (columnIndex != null && columns[columnIndex].numeric) || false
          ? "right"
          : "left"
      }
    >
      {focusedCell &&
      focusedCell.fieldName === columnData.fieldName &&
      focusedCell.rowIndex === rowIndex
        ? inputRenderer()
        : valueRenderer()}
    </MuiTableCell>
  );
};
export default TableCell;
