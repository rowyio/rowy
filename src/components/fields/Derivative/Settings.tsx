import { lazy, Suspense } from "react";
import { ISettingsProps } from "../types";

import { Grid, InputLabel, FormHelperText } from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";
import FieldsDropdown from "@src/components/Table/ColumnMenu/FieldsDropdown";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";

import { FieldType } from "@src/constants/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { WIKI_LINKS } from "@src/constants/externalLinks";

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

export default function Settings({
  config,
  onChange,
  fieldName,
  onBlur,
  errors,
}: ISettingsProps) {
  const { tableState } = useProjectContext();
  if (!tableState?.columns) return <></>;

  const columnOptions = Object.values(tableState.columns)
    .filter((column) => column.fieldName !== fieldName)
    .filter((column) => column.type !== FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));

  return (
    <>
      <Grid container direction="row" spacing={2} flexWrap="nowrap">
        <Grid item xs={12} md={6}>
          <MultiSelect
            label="Listener fields"
            options={columnOptions}
            value={config.listenerFields ?? []}
            onChange={onChange("listenerFields")}
            TextFieldProps={{
              helperText: (
                <>
                  {errors.listenerFields && (
                    <FormHelperText error style={{ margin: 0 }}>
                      {errors.listenerFields}
                    </FormHelperText>
                  )}
                  <FormHelperText error={false} style={{ margin: 0 }}>
                    Changes to these fields will trigger the evaluation of the
                    column.
                  </FormHelperText>
                </>
              ),
              FormHelperTextProps: { component: "div" } as any,
              required: true,
              error: errors.listenerFields,
              onBlur,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FieldsDropdown
            label="Output field type"
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
              onChange("renderFieldType")(value);
            }}
            TextFieldProps={{
              required: true,
              error: errors.renderFieldType,
              helperText: errors.renderFieldType,
              onBlur,
            }}
          />
        </Grid>
      </Grid>

      <div>
        <InputLabel>Derivative script</InputLabel>
        <CodeEditorHelper docLink={WIKI_LINKS.fieldTypesDerivative} />
        <Suspense fallback={<FieldSkeleton height={200} />}>
          <CodeEditor value={config.script} onChange={onChange("script")} />
        </Suspense>
      </div>
    </>
  );
}

export const settingsValidator = (config) => {
  const errors: Record<string, any> = {};
  if (!config.listenerFields) errors.listenerFields = "Required";
  if (!config.renderFieldType) errors.renderFieldType = "Required";
  return errors;
};
