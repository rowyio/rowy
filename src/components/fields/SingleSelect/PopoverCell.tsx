import { IPopoverCellProps } from "../types";

import MultiSelect_ from "@rowy/multiselect";

import { sanitiseValue } from "./utils";

export default function SingleSelect({
  value,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
}: IPopoverCellProps) {
  const config = column.config ?? {};

  return (
    <MultiSelect_
      value={sanitiseValue(value)}
      onChange={onSubmit}
      options={config.options ?? []}
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
