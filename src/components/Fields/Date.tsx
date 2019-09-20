import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  // KeyboardDatePicker,
  DatePicker,
  DateTimePicker
} from "@material-ui/pickers";
import { FieldType } from ".";

const Date = (props: any) => {
  const { value, row, onSubmit, fieldType } = props;
  function handleDateChange(date: Date | null) {
    if (date) {
      onSubmit(row.ref, date);
    }
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {fieldType === FieldType.date ? (
        <DatePicker
          value={value ? value.toDate() : null}
          onChange={handleDateChange}
          emptyLabel="select a date"
        />
      ) : (
        <DateTimePicker
          value={value ? value.toDate() : null}
          onChange={handleDateChange}
          emptyLabel="select a time"
        />
      )}
    </MuiPickersUtilsProvider>
  );
};
export default Date;
