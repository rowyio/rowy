import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  // KeyboardDatePicker,
  DateTimePicker
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";

const DateTime = (props: any) => {
  const {
    isFocusedCell,
    columnData,
    cellData,
    cellActions,
    rowData,
    rowIndex
  } = props;
  function handleDateChange(date: Date | null) {
    if (date) {
      const cell = {
        rowIndex,
        value: date,
        docId: rowData.id,
        fieldName: columnData.fieldName
      };
      cellActions.updateFirestore(cell);
    }
  }
  if (!cellData && !isFocusedCell) return <Button>click to set</Button>;
  else
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          value={cellData && cellData.toDate()}
          onChange={handleDateChange}
          emptyLabel="select a date"
        />
      </MuiPickersUtilsProvider>
    );
};
export default DateTime;
