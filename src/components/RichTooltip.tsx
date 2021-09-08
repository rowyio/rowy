import React, { useState } from "react";
import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  Tooltip,
  TooltipProps,
  Typography,
  Button,
  ButtonProps,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    tooltip: {
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[8],

      ...theme.typography.body2,
      color: theme.palette.text.primary,
      padding: 0,
    },

    arrow: {
      "&::before": {
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[2],
      },
    },

    grid: {
      padding: theme.spacing(2),
      cursor: "default",

      display: "grid",
      gridTemplateColumns: "48px auto",
      gap: theme.spacing(1, 1.5),
    },
    icon: {
      marginTop: theme.spacing(-0.5),
      fontSize: `${48 / 16}rem`,
    },
    message: {
      alignSelf: "center",
    },
    dismissButton: {
      gridColumn: 2,
      justifySelf: "flex-start",
    },
  })
);

export interface IRichTooltipProps
  extends Partial<Omit<TooltipProps, "title">> {
  render: (props: {
    openTooltip: () => void;
    closeTooltip: () => void;
    toggleTooltip: () => void;
  }) => TooltipProps["children"];

  icon?: React.ReactNode;
  title: React.ReactNode;
  message?: React.ReactNode;
  dismissButtonText?: React.ReactNode;
  dismissButtonProps?: Partial<ButtonProps>;
}

export default function RichTooltip({
  render,
  icon,
  title,
  message,
  dismissButtonText,
  dismissButtonProps,
  ...props
}: IRichTooltipProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const openTooltip = () => setOpen(true);
  const closeTooltip = () => setOpen(false);
  const toggleTooltip = () => setOpen((state) => !state);

  return (
    <Tooltip
      disableFocusListener
      disableHoverListener
      disableTouchListener
      arrow
      open={open}
      onClose={closeTooltip}
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
      title={
        <div className={classes.grid} onClick={closeTooltip}>
          <span className={classes.icon}>{icon}</span>

          <div className={classes.message}>
            <Typography variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography>{message}</Typography>
          </div>

          {dismissButtonText ? (
            <Button
              {...dismissButtonProps}
              onClick={closeTooltip}
              className={clsx(
                classes.dismissButton,
                dismissButtonProps?.className
              )}
            >
              {dismissButtonText}
            </Button>
          ) : (
            <Typography
              variant="caption"
              color="text.disabled"
              className={classes.dismissButton}
            >
              Click to dismiss
            </Typography>
          )}
        </div>
      }
      {...props}
    >
      {render({ openTooltip, closeTooltip, toggleTooltip })}
    </Tooltip>
  );
}
