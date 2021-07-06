import clsx from "clsx";
import { IHeavyCellProps } from "../types";
import { useDebouncedCallback } from "use-debounce";

import { makeStyles, createStyles } from "@material-ui/core";
import DateRangeIcon from "@material-ui/icons/DateRange";
import TimeIcon from "@material-ui/icons/Schedule";

import { DateTimeIcon } from ".";
import { DATE_TIME_FORMAT } from "constants/dates";
import { transformValue, sanitizeValue } from "../Date/utils";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  DatePickerProps,
} from "@material-ui/pickers";

import { useFiretableContext } from "contexts/FiretableContext";
import BasicCell from "./BasicCell";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { height: "100%" },
    inputBase: {
      height: "100%",
      color: "inherit",
    },

    inputAdornment: {
      height: "100%",
      marginLeft: theme.spacing(1) + 1,
      marginRight: theme.spacing(0.25),
    },

    input: {
      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: "inherit",
      height: "100%",
      padding: theme.spacing(1.5, 0),
    },

    dateTabIcon: {
      color: theme.palette.primary.contrastText,
    },

    disabledCell: {
      color: theme.palette.text.disabled,
      display: "flex",
      alignItems: "center",
    },
  })
);

export default function DateTime({
  rowIdx,
  column,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const classes = useStyles();
  const { dataGridRef } = useFiretableContext();

  const transformedValue = transformValue(value);

  const [handleDateChange] = useDebouncedCallback<DatePickerProps["onChange"]>(
    (date) => {
      const sanitized = sanitizeValue(date);
      if (sanitized === undefined) return;

      onSubmit(sanitized);
      if (dataGridRef?.current?.selectCell)
        dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
    },
    500
  );

  if (disabled)
    return (
      <div className={classes.disabledCell}>
        <BasicCell
          value={value}
          type={(column as any).type}
          name={column.key}
        />
      </div>
    );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        value={transformedValue}
        onChange={handleDateChange}
        onClick={(e) => e.stopPropagation()}
        format={DATE_TIME_FORMAT}
        fullWidth
        clearable
        keyboardIcon={<DateTimeIcon />}
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
