import { makeStyles, createStyles } from "@mui/styles";
import { FormLabel, FormLabelProps, Tooltip, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/HelpOutline";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "block",
      marginBottom: theme.spacing(1),
    },
  })
);

export interface ILabelProps extends FormLabelProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
}

export default function Label({
  label,
  children,
  hint,
  ...props
}: ILabelProps) {
  const classes = useStyles();

  return (
    <FormLabel className={classes.root} {...props}>
      {label || children}

      {hint && (
        <Tooltip title={hint}>
          <IconButton aria-label="delete">
            <HelpIcon />
          </IconButton>
        </Tooltip>
      )}
    </FormLabel>
  );
}
