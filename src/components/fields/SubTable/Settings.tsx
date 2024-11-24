import { useAtom } from "jotai";
import { ISettingsProps } from "@src/components/fields/types";
import { useState } from "react";
import MultiSelect from "@rowy/multiselect";
import { FieldType } from "@src/constants/fields";
import { TextField } from "@mui/material";
import { tableScope, tableColumnsOrderedAtom } from "@src/atoms/tableScope";

const Settings = ({ config, onChange }: ISettingsProps) => {
  const [tableOrderedColumns] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [inputValue, setInputValue] = useState("");
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
    <>
      <MultiSelect
        label="Parent label"
        options={columnOptions}
        value={config.parentLabel ?? []}
        onChange={onChange("parentLabel")}
      />

      <TextField
        id="subcollectionid"
        value={inputValue}
        onChange={(e) =>
         { onChange("subcollectionid")(e.target.value)
          setInputValue(e.target.value)}
        }
        label="Subcollection ID"
        className="labelVertical"
        inputProps={{ style: { width: "23ch" } }}
      />
    </>
  );
};
export default Settings;
