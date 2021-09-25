import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "../types";

import { ButtonBase, Box } from "@mui/material";

export const Color = forwardRef(function Color(
  { value, showPopoverCell, disabled }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
      className="cell-collapse-padding"
      sx={{
        font: "inherit",
        letterSpacing: "inherit",
        p: "var(--cell-padding)",
        justifyContent: "flex-start",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          mr: 1,

          backgroundColor: value?.hex,
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inset`,
          borderRadius: 0.5,
        }}
      />

      {value?.hex}
    </ButtonBase>
  );
});

export default Color;
