import MultiSelect from "@rowy/multiselect";
import { FieldType } from "constants/fields";
import { useProjectContext } from "contexts/ProjectContext";

const Settings = ({ config, handleChange }) => {
  const { tableState } = useProjectContext();
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
        label="Parent label"
        options={columnOptions}
        value={config.parentLabel ?? []}
        onChange={handleChange("parentLabel")}
      />
    </>
  );
};
export default Settings;
