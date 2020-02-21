import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, InputAdornment } from "@material-ui/core";
import { FieldType, DateIcon, DateTimeIcon } from "constants/fields";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "constants/dates";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";

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

    "@global": {
      ".rdg-editor-container": { display: "none" },
    },
  })
);

function Date({ column, value, onSubmit }: CustomCellProps) {
  const classes = useStyles();

  const transformedValue = value && "toDate" in value ? value.toDate() : null;

  const fieldType = (column as any).type;
  const Picker =
    fieldType === FieldType.date ? KeyboardDatePicker : KeyboardDateTimePicker;
  const Icon = fieldType === FieldType.date ? DateIcon : DateTimeIcon;

  const handleDateChange = (date: Date | null) => onSubmit(date);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Picker
        value={transformedValue}
        onChange={handleDateChange}
        format={fieldType === FieldType.date ? DATE_FORMAT : DATE_TIME_FORMAT}
        // emptyLabel="Select a date"
        fullWidth
        InputProps={{
          disableUnderline: true,
          classes: { input: classes.input },
          startAdornment: (
            <InputAdornment position="start">
              <Icon className={classes.icon} />
            </InputAdornment>
          ),
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

export default withCustomCell(Date);
