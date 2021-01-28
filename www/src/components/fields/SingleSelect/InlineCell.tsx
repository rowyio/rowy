import React from "react";
import clsx from "clsx";
import { IPopoverInlineCellProps } from "../types";

import { makeStyles, createStyles, ButtonBase } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { sanitiseValue } from "./utils";

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
      maxWidth: `calc(100% - 24px)`,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    icon: {
      display: "block",
      color: theme.palette.action.active,
    },
    disabled: {
      color: theme.palette.action.disabled,
    },
  })
);

export const SingleSelect = React.forwardRef(function SingleSelect(
  { value, showPopoverCell, disabled }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const classes = useStyles();

  return (
    <ButtonBase
      className={clsx("cell-collapse-padding", classes.root)}
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
    >
      <div className={classes.value}>{sanitiseValue(value)}</div>

      <ArrowDropDownIcon
        className={clsx(classes.icon, disabled && classes.disabled)}
      />
    </ButtonBase>
  );
});
export default SingleSelect;
