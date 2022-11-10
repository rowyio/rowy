import { IEditorCellProps } from "@src/components/fields/types";

import ConnectTableSelect from "./ConnectTableSelect";

export default function ConnectTable({
  value,
  onChange,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  row,
  disabled,
}: IEditorCellProps) {
  const config = column.config ?? {};
  if (!config || !config.primaryKeys) return null;

  return (
    <ConnectTableSelect
      row={row}
      column={column}
      value={value}
      onChange={onChange}
      config={(config as any) ?? {}}
      disabled={disabled}
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
      onClose={() => {
        showPopoverCell(false);
        onSubmit();
      }}
      loadBeforeOpen
    />
  );
}
