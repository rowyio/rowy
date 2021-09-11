import { ISideDrawerFieldProps } from "../types";

import { useTheme } from "@mui/material";
// import {
//   KeyboardDateTimePicker,
//   KeyboardDateTimePickerProps,
// } from "@material-ui/pickers";

// import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";

export interface IDateTimeProps extends ISideDrawerFieldProps {
  // ,Omit<
  //   KeyboardDateTimePickerProps,
  //   "name" | "onChange" | "value" | "disabled"
  // >
}

export default function DateTime({}: IDateTimeProps) {
  const theme = useTheme();

  return <></>;

  // TODO: return (
  //   <Controller
  //     control={control}
  //     name={column.key}
  //     render={({ onChange, onBlur, value }) => {
  //       const transformedValue = transformValue(value);

  //       const handleChange = (date: Date | null) => {
  //         const sanitized = sanitizeValue(date);
  //         if (sanitized === undefined) return;
  //         onChange(sanitized);
  //       };

  //       return (
  //         <MuiPickersUtilsProvider utils={DateFnsUtils}>
  //           <KeyboardDateTimePicker
  //             variant="inline"
  //             inputVariant="filled"
  //             fullWidth
  //             margin="none"
  //             format={DATE_TIME_FORMAT}
  //             placeholder={DATE_TIME_FORMAT}
  //             InputAdornmentProps={{
  //               style: { marginRight: theme.spacing(-1) },
  //             }}
  //             keyboardIcon={<TimeIcon />}
  //             {...props}
  //             value={transformedValue}
  //             onChange={handleChange}
  //             onBlur={onBlur}
  //             label=""
  //             hiddenLabel
  //             id={`sidedrawer-field-${column.key}`}
  //             dateRangeIcon={
  //               <DateRangeIcon
  //                 style={{ color: theme.palette.primary.contrastText }}
  //               />
  //             }
  //             timeIcon={
  //               <TimeIcon
  //                 style={{ color: theme.palette.primary.contrastText }}
  //               />
  //             }
  //             disabled={disabled}
  //           />
  //         </MuiPickersUtilsProvider>
  //       );
  //     }}
  //   />
  // );
}
