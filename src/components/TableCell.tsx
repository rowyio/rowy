import React, { useState } from "react";
import { TableCell as MuiTableCell, Switch } from "@material-ui/core";
import clsx from "clsx";
import { FieldType } from "./Fields";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import SimpleText from "./Fields/SimpleText";
import CheckBox from "./Fields/CheckBox";

import Number from "./Fields/Number";
import Rating from "./Fields/Rating";
import Date from "./Fields/Date";
import DateTime from "./Fields/DateTime";

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
  const isFocusedCell =
    focusedCell &&
    focusedCell.fieldName === columnData.fieldName &&
    focusedCell.rowIndex === rowIndex;
  /*
  const inputRenderer = () => {
    switch (fieldType) {
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
        return (
          <Rating
            name="pristine"
            value={cellData}
            precision={0.5}
            onChange={(event, newValue) => {
              cellActions.update(newValue);
            }}
          />
        );
    
 
  */

  const renderCell = () => {
    switch (fieldType) {
      case FieldType.checkBox:
        return (
          <CheckBox
            rowIndex={rowIndex}
            rowData={rowData}
            isFocusedCell={isFocusedCell}
            cellData={cellData}
            cellActions={cellActions}
            columnData={columnData}
          />
        );
      case FieldType.rating:
        return (
          <Rating
            rowIndex={rowIndex}
            rowData={rowData}
            isFocusedCell={isFocusedCell}
            cellData={cellData}
            cellActions={cellActions}
            columnData={columnData}
          />
        );
      case FieldType.date:
        return (
          <Date
            rowIndex={rowIndex}
            rowData={rowData}
            isFocusedCell={isFocusedCell}
            cellData={cellData}
            cellActions={cellActions}
            columnData={columnData}
          />
        );
      case FieldType.dateTime:
        return (
          <DateTime
            rowIndex={rowIndex}
            rowData={rowData}
            isFocusedCell={isFocusedCell}
            cellData={cellData}
            cellActions={cellActions}
            columnData={columnData}
          />
        );
      case FieldType.number:
        return (
          <Number
            isFocusedCell={isFocusedCell}
            cellData={cellData}
            cellActions={cellActions}
            columnData={columnData}
          />
        );
      default:
        return (
          <SimpleText
            isFocusedCell={isFocusedCell}
            cellData={cellData}
            cellActions={cellActions}
            columnData={columnData}
          />
        );
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
      {renderCell()}
    </MuiTableCell>
  );
};
export default TableCell;
