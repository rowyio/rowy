import React from "react";
import clsx from "clsx";

import { useDebouncedCallback } from "use-debounce";

import { makeStyles, createStyles } from "@material-ui/core";
import DateRangeIcon from "@material-ui/icons/DateRange";
import TimeIcon from "@material-ui/icons/Schedule";

import { FieldType, DateIcon, DateTimeIcon } from "constants/fields";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "constants/dates";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  DatePickerProps,
} from "@material-ui/pickers";

import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
    },
    inputBase: { height: "100%" },

    inputAdornment: {
      height: "100%",
      marginLeft: theme.spacing(1) + 1,
      marginRight: theme.spacing(0.25),
    },

    input: {
      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.secondary,
      height: "100%",
      padding: theme.spacing(1.5, 0),
    },

    dateTabIcon: {
      color: theme.palette.primary.contrastText,
    },
  })
);

export default function Date({ rowIdx, column, value, onSubmit }: any) {
  const classes = useStyles();
  const { dataGridRef } = useFiretableContext();

  const transformedValue =
    value && typeof value !== "number" && "toDate" in value
      ? value.toDate()
      : null;

  const fieldType = (column as any).type;
  const Picker =
    fieldType === FieldType.date ? KeyboardDatePicker : KeyboardDateTimePicker;
  const Icon = fieldType === FieldType.date ? DateIcon : DateTimeIcon;

  const [handleDateChange] = useDebouncedCallback<DatePickerProps["onChange"]>(
    (date) => {
      if (isNaN(date?.valueOf() ?? 0)) return;

      onSubmit(date);
      if (dataGridRef?.current?.selectCell)
        dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
    },
    500
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Picker
        value={transformedValue}
        onChange={handleDateChange}
        onClick={(e) => e.stopPropagation()}
        format={fieldType === FieldType.date ? DATE_FORMAT : DATE_TIME_FORMAT}
        fullWidth
        clearable
        keyboardIcon={<Icon />}
        className={clsx("cell-collapse-padding", classes.root)}
        inputVariant="standard"
        InputProps={{
          disableUnderline: true,
          classes: { root: classes.inputBase, input: classes.input },
        }}
        InputAdornmentProps={{
          position: "start",
          classes: { root: classes.inputAdornment },
        }}
        KeyboardButtonProps={{
          size: "small",
          classes: { root: "row-hover-iconButton" },
        }}
        DialogProps={{ onClick: (e) => e.stopPropagation() }}
        dateRangeIcon={<DateRangeIcon className={classes.dateTabIcon} />}
        timeIcon={<TimeIcon className={classes.dateTabIcon} />}
      />
    </MuiPickersUtilsProvider>
  );
}
