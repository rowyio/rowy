import { IEditorCellProps } from "@src/components/fields/types";

import ConnectServiceSelect from "./ConnectServiceSelect";

export default function ConnectService({
  value,
  onChange,
  column,
  parentRef,
  showPopoverCell,
  disabled,
  _rowy_ref,
}: IEditorCellProps) {
  const config = column.config ?? {};
  if (!config) return null;

  return (
    <ConnectServiceSelect
      value={value}
      onChange={onChange}
      config={(config as any) ?? {}}
      disabled={disabled}
      docRef={_rowy_ref as any}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: true,
          MenuProps: {
            anchorEl: parentRef,
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          },
          onClose: () => showPopoverCell(false),
        },
      }}
    />
  );
}
