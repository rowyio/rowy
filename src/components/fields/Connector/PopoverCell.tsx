import { IPopoverCellProps } from "../types";

import Selector from "./Select";

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
    <Selector
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
