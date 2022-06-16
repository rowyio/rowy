import { forwardRef, useMemo } from "react";
import { IPopoverInlineCellProps } from "@src/components/fields/types";

import { ButtonBase } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";
import getLabel from "./utils/getLabelHelper";

export const StatusSingleSelect = forwardRef(function StatusSingleSelect(
  { column, value, showPopoverCell, disabled }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const conditions = column.config?.conditions ?? [];
  const lowPriorityOperator = ["<", "<=", ">=", ">"];
  const otherOperator = conditions.filter(
    (c: any) => !lowPriorityOperator.includes(c.operator)
  );

  /**Revisit this  */
  const sortLowPriorityList = conditions
    .filter((c: any) => {
      return lowPriorityOperator.includes(c.operator);
    })
    .sort((a: any, b: any) => {
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

export default StatusSingleSelect;
