import { lazy, Suspense } from "react";
import { Typography } from "@material-ui/core";
import MultiSelect from "@antlerengineering/multiselect";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";
import { FieldType } from "constants/fields";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";
import { useFiretableContext } from "contexts/FiretableContext";
import CodeEditorHelper from "components/CodeEditorHelper";

import WIKI_LINKS from "constants/wikiLinks";

const CodeEditor = lazy(
  () =>
    import(
      "components/Table/editors/CodeEditor" /* webpackChunkName: "CodeEditor" */
    )
);

const Settings = ({ config, handleChange }) => {
  const { tableState } = useFiretableContext();
  if (!tableState?.columns) return <></>;
  const columnOptions = Object.values(tableState.columns)
    .filter((column) => column.type !== FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));
  return (
    <>
      <MultiSelect
        label={"Listener fields (this script runs when these fields change)"}
        options={columnOptions}
        value={config.listenerFields ?? []}
        onChange={handleChange("listenerFields")}
      />
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
      <Typography variant="overline">derivative script</Typography>
      <CodeEditorHelper docLink={WIKI_LINKS.derivatives} />
      <Suspense fallback={<FieldSkeleton height={200} />}>
        <CodeEditor
          script={config.script}
          handleChange={handleChange("script")}
        />
      </Suspense>
    </>
  );
};
export default Settings;
