import { lazy, Suspense } from "react";
import { Typography, Grid } from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";
import { FieldType } from "constants/fields";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";
import { useProjectContext } from "contexts/ProjectContext";
import CodeEditorHelper from "components/CodeEditorHelper";

import WIKI_LINKS from "constants/wikiLinks";

const CodeEditor = lazy(
  () =>
    import(
      "components/Table/editors/CodeEditor" /* webpackChunkName: "CodeEditor" */
    )
);

const Settings = ({ config, handleChange }) => {
  const { tableState } = useProjectContext();
  if (!tableState?.columns) return <></>;
  const columnOptions = Object.values(tableState.columns)
    .filter((column) => column.type !== FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));
  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="overline">listener Fields</Typography>
          <MultiSelect
            //label={"Listener fields"}
            options={columnOptions}
            value={config.listenerFields ?? []}
            onChange={handleChange("listenerFields")}
          />
          <Typography color="textSecondary" paragraph>
            Changes to these fields will trigger the evaluation of the column.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="overline">Output Field type</Typography>
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
        </Grid>
      </Grid>
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
