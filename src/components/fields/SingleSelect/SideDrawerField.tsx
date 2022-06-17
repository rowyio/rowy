import { ISideDrawerFieldProps } from "@src/components/fields/types";

import MultiSelect from "@rowy/multiselect";
import { getFieldId } from "@src/components/SideDrawer/utils";
import { sanitiseValue } from "./utils";

export default function SingleSelect({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  return (
    <MultiSelect
      value={sanitiseValue(value)}
      onChange={onChange}
      options={config.options ?? []}
      multiple={false}
      freeText={config.freeText}
      disabled={disabled}
      TextFieldProps={{
        label: "",
        hiddenLabel: true,
        onBlur: onSubmit,
        id: getFieldId(column.key),
      }}
      onClose={onSubmit}
    />
  );
}
