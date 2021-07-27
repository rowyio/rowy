import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/core";
import RichTooltip from "components/RichTooltip";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "&&": {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: "var(--cell-padding)",

        overflow: "hidden",
        contain: "strict",
        display: "flex",
        alignItems: "center",
      },
    },

    isInvalid: {
      boxShadow: `inset 0 0 0 2px ${theme.palette.error.main}`,
    },

    dot: {
      position: "absolute",
      right: -5,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 1,

      width: 12,
      height: 12,

      borderRadius: "50%",
      backgroundColor: theme.palette.error.main,
    },
  })
);

export interface ICellValidationProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  value: any;
  required?: boolean;
  validationRegex?: string;
}

export default function CellValidation({
  value,
  required,
  validationRegex,

  className,
  children,
  ...props
}: ICellValidationProps) {
  const classes = useStyles();

  const isInvalid = validationRegex && !new RegExp(validationRegex).test(value);
  const isMissing = required && value === undefined;

  if (isInvalid)
    return (
      <>
        <RichTooltip
          emoji="⛔️"
          message="Invalid data. This row will not be registered to the database until all the required fields are validated."
          placement="right"
          render={({ openTooltip }) => (
            <div className={classes.dot} onClick={openTooltip} />
          )}
        />

        <div
          {...props}
          className={clsx(classes.root, classes.isInvalid, className)}
        >
          {children}
        </div>
      </>
    );

  if (isMissing)
    return (
      <>
        <RichTooltip
          emoji="⚠️"
          message="Required field. This row will not be registered to the database until all the required fields contain valid data."
          placement="right"
          render={({ openTooltip }) => (
            <div className={classes.dot} onClick={openTooltip} />
          )}
        />

        <div
          {...props}
          className={clsx(classes.root, classes.isInvalid, className)}
        >
          {children}
        </div>
      </>
    );

  return (
    <div {...props} className={clsx(classes.root, className)}>
      {children}
    </div>
  );
}
