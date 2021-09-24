import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "../types";

import { ButtonBase } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
        <ArrowDropDownIcon
          className="row-hover-iconButton"
          sx={{
            flexShrink: 0,
            mr: 0.5,
            borderRadius: 1,
            p: (32 - 24) / 2 / 8,
            boxSizing: "content-box",
          }}
        />
      )}
    </ButtonBase>
  );
});

export default SingleSelect;
