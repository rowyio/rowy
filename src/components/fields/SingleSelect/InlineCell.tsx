import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "@src/components/fields/types";

import { ButtonBase } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import { sanitiseValue } from "./utils";

export const SingleSelect = forwardRef(function SingleSelect(
  { value, showPopoverCell, disabled }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
      className="cell-collapse-padding"
      style={{
        padding: "var(--cell-padding)",
        paddingRight: 0,
        height: "100%",

        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        {sanitiseValue(value)}
      </div>

      {!disabled && (
        <ChevronDown
          className="row-hover-iconButton"
          sx={{
            flexShrink: 0,
            mr: 0.5,
            borderRadius: 1,
            p: (32 - 20) / 2 / 8,
            boxSizing: "content-box !important",
          }}
        />
      )}
    </ButtonBase>
  );
});

export default SingleSelect;
