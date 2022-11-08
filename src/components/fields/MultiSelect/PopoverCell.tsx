import { IEditorCellProps } from "@src/components/fields/types";

import MultiSelectComponent from "@rowy/multiselect";

import { sanitiseValue } from "./utils";

export default function MultiSelect({
  value,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
}: IEditorCellProps) {
  const config = column.config ?? {};

  return (
    <MultiSelectComponent
      value={sanitiseValue(value)}
      onChange={onSubmit}
      options={config.options ?? []}
      multiple
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
