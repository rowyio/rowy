import React from "react";
import DateFnsUtils from "@date-io/date-fns";

import { FieldType } from ".";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  // KeyboardDatePicker,
  DatePicker,
  DateTimePicker,
} from "@material-ui/pickers";

// TODO: Create an interface for props
interface Props {
  value: firebase.firestore.Timestamp | null;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  isScrolling: boolean;
}

const Date = (props: Props) => {
  const { value, row, onSubmit, fieldType, isScrolling } = props;
  //if (isScrolling) return <div />;
  function handleDateChange(date: Date | null) {
    if (date) {
      onSubmit(date);
    }
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {fieldType === FieldType.date ? (
        <DatePicker
          value={value ? value.toDate() : null}
          onChange={handleDateChange}
          format="dd/MM/yy"
          emptyLabel="select a date"
        />
      ) : (
        <DateTimePicker
          value={value ? value.toDate() : null}
          onChange={handleDateChange}
          format="dd/MM/yy HH:mm a"
          emptyLabel="select a time"
        />
      )}
    </MuiPickersUtilsProvider>
  );
};
export default Date;
