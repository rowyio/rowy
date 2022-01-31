import { forwardRef, useMemo } from "react";
import { IPopoverInlineCellProps } from "../types";

import { ButtonBase } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import _find from "lodash/find";
import getLabel from "./utils/getLabelHelper";
import { LowPriority } from "@mui/icons-material";

export const StatusSingleSelect = forwardRef(function StatusSingleSelect(
  { column, value, showPopoverCell, disabled }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const conditions = column.config?.conditions ?? [];
  const lowPriorityOperator = ["<", "<=", ">=", ">"];
  const otherOperator = conditions.filter(
    (c) => !lowPriorityOperator.includes(c.operator)
  );

  /**Revisit this  */
  const sortLowPriorityList = conditions
    .filter((c) => {
      return lowPriorityOperator.includes(c.operator);
    })
    .sort((a, b) => {
      const aDistFromValue = Math.abs(value - a.value);
      const bDistFromValue = Math.abs(value - b.value);
      //return the smallest distance
      return aDistFromValue - bDistFromValue;
    });
  const sortedConditions = [...otherOperator, ...sortLowPriorityList];
  const label = useMemo(
    () => getLabel(value, sortedConditions),
    [value, sortedConditions]
  );
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
      <div style={{ flexGrow: 1, overflow: "hidden" }}>{label}</div>

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

export default StatusSingleSelect;
