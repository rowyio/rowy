import React, { forwardRef } from "react";

import { Button, ButtonProps } from "@mui/material";
import { alpha } from "@mui/material/styles";

export interface IButtonWithStatusProps extends ButtonProps {
  active?: boolean;
}

export const ButtonWithStatus = forwardRef(function ButtonWithStatus_(
  { active = false, className, sx, ...props }: IButtonWithStatusProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Button
      {...props}
      ref={ref}
      variant="outlined"
      color={active ? "primary" : "secondary"}
      sx={[
        {
          position: "relative",
          zIndex: 1,
        },
        active
          ? {
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity
                ),
              borderColor: "primary.main",

              "&:hover": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                backgroundColor: (theme) =>
                  alpha(
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                    theme.palette.action.selectedOpacity +
                      theme.palette.action.hoverOpacity
                  ),
                borderColor: "currentColor",
              },
            }
          : {},
        ...((Array.isArray(sx) ? sx : [sx]) as any),
      ]}
    />
  );
});

export default ButtonWithStatus;
