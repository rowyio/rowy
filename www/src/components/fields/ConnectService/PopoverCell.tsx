import { IPopoverCellProps } from "../types";
import _get from "lodash/get";

import ConnectServiceSelect from "./ConnectServiceSelect";

export default function ConnectService({
  value,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
  docRef,
}: IPopoverCellProps) {
  const config = column.config ?? {};
  if (!config) return null;

  return (
    <ConnectServiceSelect
      value={value}
      onChange={onSubmit}
      config={(config as any) ?? {}}
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
