import { IEditorCellProps } from "@src/components/fields/types";

import MultiSelectComponent from "@rowy/multiselect";

import { sanitiseValue } from "./utils";

export default function SingleSelect({
  value,
  onChange,
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
      onChange={onChange}
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
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
            transformOrigin: { vertical: "top", horizontal: "center" },
            sx: {
              "& .MuiPaper-root": { minWidth: `${column.width}px !important` },
            },
          },
        },
      }}
      onClose={() => {
        showPopoverCell(false);
        onSubmit();
      }}
    />
  );
}
