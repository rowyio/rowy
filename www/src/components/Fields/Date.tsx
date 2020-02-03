import React from "react";
import DateFnsUtils from "@date-io/date-fns";

import { createStyles, makeStyles, InputAdornment } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  DateTimePicker,
} from "@material-ui/pickers";

import { FieldType, DateIcon, DateTimeIcon } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    input: {
      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.secondary,
    },
    icon: {
      color: theme.palette.text.secondary,
    },
  })
);
// TODO: Create an interface for props
interface Props {
  value: firebase.firestore.Timestamp | null;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  isScrolling: boolean;
}

const Date = (props: Props) => {
  const classes = useStyles();

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
          value={value && value.toDate ? value.toDate() : null}
          onChange={handleDateChange}
          format="dd/MM/yy"
          emptyLabel="select a date"
          fullWidth
          InputProps={{
            disableUnderline: true,
            classes: { input: classes.input },
            startAdornment: (
              <InputAdornment position="start">
                <DateIcon className={classes.icon} />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <DateTimePicker
          value={value ? value.toDate() : null}
          onChange={handleDateChange}
          format="dd/MM/yy HH:mm a"
          emptyLabel="select a time"
          fullWidth
          InputProps={{
            disableUnderline: true,
            classes: { input: classes.input },
            startAdornment: (
              <InputAdornment position="start">
                <DateTimeIcon className={classes.icon} />
              </InputAdornment>
            ),
          }}
        />
      )}
    </MuiPickersUtilsProvider>
  );
};
export default Date;
