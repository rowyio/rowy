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
  return (
    <MultiSelect_
      value={value}
      onChange={onSubmit}
      options={conditions.length >= 1 ? conditions : []} // this handles when conditions are deleted
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
