import MultiSelect from "@antlerengineering/multiselect";
import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/FiretableContext";

const Settings = ({ config, handleChange }) => {
  const { tableState } = useFiretableContext();
  if (!tableState?.columns) return <></>;
  const columnOptions = Object.values(tableState.columns)
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
        label={"Parent Label"}
        options={columnOptions}
        value={config.parentLabel ?? []}
        onChange={handleChange("parentLabel")}
      />
    </>
  );
};
export default Settings;
