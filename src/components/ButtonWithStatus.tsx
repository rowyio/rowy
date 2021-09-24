import React from "react";
import clsx from "clsx";

import { makeStyles, createStyles } from "@mui/styles";
import { Button, ButtonProps } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "relative",
      zIndex: 1,
    },

    active: {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.primary.light
          : theme.palette.primary.dark,
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
      borderColor: theme.palette.primary.main,

      "&:hover": {
        color:
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.dark,
        backgroundColor: alpha(
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.dark,
          theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        borderColor: "currentColor",
      },
    },
  })
);

export interface IButtonWithStatusProps extends ButtonProps {
  active?: boolean;
}

export const ButtonWithStatus = React.forwardRef(function ButtonWithStatus_(
  { active = false, className, ...props }: IButtonWithStatusProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const classes = useStyles();

  return (
    <Button
      {...props}
      ref={ref}
      variant="outlined"
      color={active ? "primary" : "secondary"}
      className={clsx(classes.root, active && classes.active, className)}
    />
  );
});

export default ButtonWithStatus;
