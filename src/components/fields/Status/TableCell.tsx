import { useMemo } from "react";
import { IHeavyCellProps } from "../types";

import { useStatusStyles } from "./styles";
import _find from "lodash/find";

export default function Status({ column, value }: IHeavyCellProps) {
  const statusClasses = useStatusStyles();

  const conditions = column.config?.conditions ?? [];
  const label = useMemo(() => {
    if (["null", "undefined"].includes(typeof value)) {
      const condition = _find(conditions, (c) => c.type === typeof value);
      return condition.label;
    } else if (typeof value === "number") {
      const numberConditions = conditions.filter((c) => c.type === "number");
      for (let i = 0; i < numberConditions.length; i++) {
        const condition = numberConditions[i];
        switch (condition.operator) {
          case "<":
            if (value < condition.value) return condition.label;
            break;
          case "<=":
            if (value <= condition.value) return condition.label;
            break;
          case ">=":
            if (value >= condition.value) return condition.label;
            break;
          case ">":
            if (value > condition.value) return condition.label;
            break;
          case "==":
          default:
            if (value == condition.value) return condition.label;
            break;
        }
      }
    } else {
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        if (value == condition.value) return condition.label;
      }
    }
    return JSON.stringify(value);
  }, [value, conditions]);

  return <>{label}</>;
}
