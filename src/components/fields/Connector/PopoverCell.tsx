import { IPopoverCellProps } from "../types";

import ConnectServiceSelect from "./Select";

export default function ConnectService({
  value,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
  docRef,
}: IPopoverCellProps) {
  return (
    <ConnectServiceSelect
      value={value}
      onChange={onSubmit}
      column={column}
      disabled={disabled}
      docRef={docRef}
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
