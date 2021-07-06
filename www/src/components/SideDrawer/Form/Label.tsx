import {
  makeStyles,
  createStyles,
  FormLabel,
  FormLabelProps,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/HelpOutline";

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
