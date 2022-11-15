import { forwardRef, useMemo } from "react";
import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";
import getLabel from "./utils/getLabelHelper";

export const StatusSingleSelect = forwardRef(function StatusSingleSelect({
  column,
  value,
  showPopoverCell,
  disabled,
  tabIndex,
}: IDisplayCellProps) {
  const conditions = column.config?.conditions;

  const rendered = useMemo(() => {
    const lowPriorityOperator = ["<", "<=", ">=", ">"];
    const otherOperator = (conditions ?? []).filter(
      (c: any) => !lowPriorityOperator.includes(c.operator)
    );

    /**Revisit this  */
    const sortLowPriorityList = (conditions ?? [])
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

    return (
      <div
        style={{
          flexGrow: 1,
          overflow: "hidden",
          paddingLeft: "var(--cell-padding)",
        }}
      >
        {getLabel(value, sortedConditions)}
      </div>
    );
  }, [value, conditions]);

  if (disabled) return rendered;

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      style={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
      tabIndex={tabIndex}
    >
      {rendered}
      <ChevronDown className="row-hover-iconButton end" />
    </ButtonBase>
  );
});

export default StatusSingleSelect;
