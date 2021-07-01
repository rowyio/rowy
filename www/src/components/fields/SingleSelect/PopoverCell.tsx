import { IPopoverCellProps } from "../types";
import _get from "lodash/get";

import MultiSelect_ from "@antlerengineering/multiselect";

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
      label={column.name}
      labelPlural={column.name}
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
