import MultiSelect from "@rowy/multiselect";
import { FieldType } from "@src/constants/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";

const Settings = ({ config, onChange }) => {
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
        onChange={onChange("parentLabel")}
      />
    </>
  );
};
export default Settings;
