import React, { useState } from "react";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  Tooltip,
  TooltipProps,
  Button,
  ButtonProps,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    tooltip: {
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[2],

      ...theme.typography.caption,
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
      gridTemplateColumns: "40px auto",
      gap: theme.spacing(1, 2),
    },
    emoji: {
      fontSize: `${40 / 16}rem`,
      fontWeight: 400,
      fontFamily:
        "apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol",
    },
    message: {
      alignSelf: "center",
    },
    dismissButton: {
      marginLeft: theme.spacing(-1),
      gridColumn: 2,
      justifySelf: "flex-start",
    },
  })
);

export interface IRichTooltipProps extends Partial<TooltipProps> {
  render: (props: {
    openTooltip: () => void;
    closeTooltip: () => void;
    toggleTooltip: () => void;
  }) => TooltipProps["children"];

  emoji?: React.ReactNode;
  message: React.ReactNode;
  dismissButtonText?: React.ReactNode;
  dismissButtonProps?: Partial<ButtonProps>;
}

export default function RichTooltip({
  render,
  emoji,
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
      interactive
      open={open}
      onClose={closeTooltip}
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
      title={
        <div className={classes.grid} onClick={closeTooltip}>
          <span className={classes.emoji}>{emoji}</span>

          <div className={classes.message}>{message}</div>

          {dismissButtonText && (
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
          )}
        </div>
      }
      {...props}
    >
      {render({ openTooltip, closeTooltip, toggleTooltip })}
    </Tooltip>
  );
}
