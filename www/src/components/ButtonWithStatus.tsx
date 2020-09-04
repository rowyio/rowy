import React from "react";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  Button,
  ButtonProps,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    active: {
      borderColor: "currentColor",
      backgroundColor: fade(
        theme.palette.primary.main,
        theme.palette.action.hoverOpacity
      ),

      "&:hover": {
        color: theme.palette.primary.dark,
        backgroundColor: fade(
          theme.palette.primary.dark,
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
      color="primary"
      className={clsx(active && classes.active, className)}
    />
  );
});

export default ButtonWithStatus;
