import { lazy, Suspense } from "react";
import { Typography } from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";
import { FieldType } from "constants/fields";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";
import { useProjectContext } from "contexts/ProjectContext";
const CodeEditor = lazy(
  () =>
    import(
      "components/Table/editors/CodeEditor" /* webpackChunkName: "CodeEditor" */
    )
);

const Settings = ({ config, handleChange }) => {
  const { tableState } = useProjectContext();

  const columnOptions = Object.values(tableState?.columns ?? {})
    .filter((column) => column.type === FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));
  return (
    <>
      <MultiSelect
        label="Sub-tables"
        options={columnOptions}
        value={config.requiredFields ?? []}
        onChange={handleChange("subtables")}
      />
      <Typography variant="overline">Aggergate script</Typography>
      <Suspense fallback={<FieldSkeleton height={200} />}>
        <CodeEditor
          script={
            config.script ??
            `//triggerType:  create | update | delete\n//aggregateState: the subtable accumulator stored in the cell of this column\n//snapshot: the triggered document snapshot of the the subcollection\n//incrementor: short for firebase.firestore.FieldValue.increment(n);\n//This script needs to return the new aggregateState cell value.
switch (triggerType){
  case "create":return {
      count:incrementor(1)
  }
  case "update":return {}
  case "delete":
  return {
      count:incrementor(-1)
  }
}`
          }
          extraLibs={[
            `  /**
    * increaments firestore field value
    */",
    function incrementor(value:number):number {

    }`,
          ]}
          handleChange={handleChange("script")}
        />
      </Suspense>

      <Typography variant="overline">Field type of the output</Typography>
      <FieldsDropdown
        value={config.renderFieldType}
        options={Object.values(FieldType).filter(
          (f) =>
            ![
              FieldType.derivative,
              FieldType.aggregate,
              FieldType.subTable,
              FieldType.action,
            ].includes(f)
        )}
        onChange={(value) => {
          handleChange("renderFieldType")(value);
        }}
      />
    </>
  );
};
export default Settings;
