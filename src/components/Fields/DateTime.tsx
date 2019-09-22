import React from "react";
import DateFnsUtils from "@date-io/date-fns";

import { Button } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  // KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";

const DateTime = (props: any) => {
  const {
    isFocusedCell,
    columnData,
    cellData,
    cellActions,
    rowData,
    rowIndex,
  } = props;
  function handleDateChange(date: Date | null) {
    if (date) {
      const cell = {
        rowIndex,
        value: date,
        docRef: rowData.ref,
        fieldName: columnData.fieldName,
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
