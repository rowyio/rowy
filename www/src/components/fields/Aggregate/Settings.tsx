import { useState, lazy, Suspense } from "react";
import {
  Typography,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from "@material-ui/core";
import MultiSelect from "@antlerengineering/multiselect";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";
import { FieldType } from "constants/fields";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";
import { useFiretableContext } from "contexts/FiretableContext";
const CodeEditor = lazy(
  () =>
    import(
      "components/Table/editors/CodeEditor" /* webpackChunkName: "CodeEditor" */
    )
);

const Settings = ({ config, handleChange }) => {
  const { tableState } = useFiretableContext();

  const columnOptions = Object.values(tableState?.columns ?? {})
    .filter((column) => column.type === FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));
  return (
    <>
      <MultiSelect
        label={"Sub Tables"}
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
        onChange={(newType: any) => {
          handleChange("renderFieldType")(newType.target.value);
        }}
      />
    </>
  );
};
export default Settings;
