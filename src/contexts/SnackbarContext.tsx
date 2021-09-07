import {
  SnackbarProvider as NotistackProvider,
  SnackbarProviderProps,
} from "notistack";

import { makeStyles, createStyles } from "@material-ui/styles";
import { Grow } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import SuccessIcon from "@material-ui/icons/Check";
import WarningIcon from "@material-ui/icons/WarningAmber";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .SnackbarItem-contentRoot": {
        borderRadius: (theme.shape.borderRadius as number) * 1.5,
        boxShadow: theme.shadows[6],

        "&.SnackbarItem-variantError": {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
        },
        "&.SnackbarItem-variantInfo": {
          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        },
        "&.SnackbarItem-variantSuccess": {
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
        },
        "&.SnackbarItem-variantWarning": {
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
        },
      },
    },
  })
);

export function SnackbarProvider(props: SnackbarProviderProps) {
  const classes = useStyles();

  return (
    <NotistackProvider
      TransitionComponent={Grow as any}
      iconVariant={{
        error: <ErrorIcon sx={{ ml: -0.75, mr: 1 }} />,
        info: <InfoIcon sx={{ ml: -0.75, mr: 1 }} />,
        success: <SuccessIcon sx={{ ml: -0.75, mr: 1 }} />,
        warning: <WarningIcon sx={{ ml: -0.75, mr: 1 }} />,
      }}
      {...props}
      classes={{ ...classes, ...props.classes }}
    />
  );
}

export default SnackbarProvider;
