import { useAtom } from "jotai";
import { ISettingsProps } from "@src/components/fields/types";

import MultiSelect from "@rowy/multiselect";
import { FieldType } from "@src/constants/fields";

import { tableScope, tableColumnsOrderedAtom } from "@src/atoms/tableScope";

const Settings = ({ config, onChange }: ISettingsProps) => {
  const [tableOrderedColumns] = useAtom(tableColumnsOrderedAtom, tableScope);

  const columnOptions = tableOrderedColumns
    .filter((column) =>
      [
        FieldType.shortText,
        FieldType.singleSelect,
        FieldType.email,
        FieldType.phone,
      ].includes(column.type)
    )
    .map((c) => ({ label: c.name, value: c.key }));

  return (
    <MultiSelect
      label="Parent label"
      options={columnOptions}
      value={config.parentLabel ?? []}
      onChange={onChange("parentLabel")}
    />
  );
};
export default Settings;
