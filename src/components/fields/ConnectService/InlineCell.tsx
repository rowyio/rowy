import React from "react";
import clsx from "clsx";
import { IPopoverInlineCellProps } from "../types";

import { makeStyles, createStyles } from "@material-ui/styles";
import { ButtonBase, Grid, Chip } from "@material-ui/core";
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
      height: 24,
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

export const ConnectService = React.forwardRef(function ConnectService(
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
            <Grid item key={doc.primaryKey}>
              <Chip
                label={config.titleKey}
                className={classes.chip}
                size="small"
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
export default ConnectService;
