import { IPopoverCellProps } from "../types";
import _get from "lodash/get";

import ConnectTableSelect from "./ConnectTableSelect";

export default function ConnectTable({
  value,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  row,
  disabled,
}: IPopoverCellProps) {
  const config = column.config ?? {};
  if (!config || !config.primaryKeys) return null;

  return (
    <ConnectTableSelect
      row={row}
      column={column}
      value={value}
      onChange={onSubmit}
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
      onClose={() => showPopoverCell(false)}
      loadBeforeOpen
    />
  );
}
