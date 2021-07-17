import React from "react";
import clsx from "clsx";
import { IPopoverInlineCellProps } from "../types";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  Grid,
  Chip,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      padding: theme.spacing(0, 1, 0, 1.5),

      font: "inherit",
      color: "inherit !important",
      letterSpacing: "inherit",
      textAlign: "inherit",
      justifyContent: "flex-start",
    },

    value: {
      flex: 1,
      maxWidth: `calc(100% - 24px + 4px)`,
      overflow: "hidden",
      marginRight: 0,
    },
    chip: {
      display: "flex",
      cursor: "inherit",
    },
    chipLabel: { whiteSpace: "nowrap" },

    icon: {
      display: "block",
      color: theme.palette.action.active,
    },
    disabled: {
      color: theme.palette.action.disabled,
    },
  })
);

export const ConnectTable = React.forwardRef(function ConnectTable(
  { value, showPopoverCell, disabled, column }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const classes = useStyles();
  const config = column.config ?? {};

  return (
    <ButtonBase
      className={clsx("cell-collapse-padding", classes.root)}
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
    >
      <Grid
        container
        wrap="nowrap"
        alignItems="center"
        spacing={1}
        className={classes.value}
      >
        {Array.isArray(value) &&
          value.map((doc: any) => (
            <Grid item key={doc.docPath}>
              <Chip
                label={config.primaryKeys
                  .map((key: string) => doc.snapshot[key])
                  .join(" ")}
                size="small"
                className={classes.chip}
              />
            </Grid>
          ))}
      </Grid>

      <ArrowDropDownIcon
        className={clsx(classes.icon, disabled && classes.disabled)}
      />
    </ButtonBase>
  );
});
export default ConnectTable;
