import _find from "lodash/find";
import { IPopoverCellProps } from "../types";
import MultiSelect_ from "@rowy/multiselect";

export default function StatusSingleSelect({
  value,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
}: IPopoverCellProps) {
  const config = column.config ?? {};
  const conditions = config.conditions ?? [];
  /**Revisit eventually, can we abstract or use a helper function to clean this? */
  const reMappedConditions = conditions.map((c) => {
    let rValue = { ...c };
    if (c.type === "number") {
      if (c.operator === "<") rValue = { ...c, value: c.value - 1 };
      if (c.operator === ">") rValue = { ...c, value: c.value + 1 };
    }
    return rValue;
  });
  return (
    <MultiSelect_
      value={value}
      onChange={(v) => onSubmit(v)}
      options={conditions.length >= 1 ? reMappedConditions : []} // this handles when conditions are deleted
      multiple={false}
      freeText={config.freeText}
      disabled={disabled}
      label={column.name as string}
      labelPlural={column.name as string}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: true,
          MenuProps: {
            anchorEl: parentRef,
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          },
        },
      }}
      onClose={() => showPopoverCell(false)}
    />
  );
}
