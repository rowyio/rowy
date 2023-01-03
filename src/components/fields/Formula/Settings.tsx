import { lazy, Suspense, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useAtom } from "jotai";
import MultiSelect from "@rowy/multiselect";

import {
  Grid,
  InputLabel,
  Typography,
  Stack,
  FormHelperText,
  Tooltip,
} from "@mui/material";

import {
  tableColumnsOrderedAtom,
  tableSchemaAtom,
  tableScope,
} from "@src/atoms/tableScope";

import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import { ISettingsProps } from "@src/components/fields/types";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";
import { ColumnConfig } from "@src/types/table";

import { defaultFn, listenerFieldTypes, outputFieldTypes } from "./util";
import PreviewTable from "./PreviewTable";
import { getFieldProp } from "..";

/* eslint-disable import/no-webpack-loader-syntax */
import formulaDefs from "!!raw-loader!./formula.d.ts";

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

export default function Settings({
  config,
  fieldName,
  onChange,
  onBlur,
  errors,
}: ISettingsProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const returnType = getFieldProp("dataType", config.renderFieldType) ?? "any";
  const formulaFn = config?.formulaFn ? config.formulaFn : defaultFn;

  const previewTableSchema = useMemo(() => {
    const columns = tableSchema.columns || {};
    return {
      ...tableSchema,
      columns: Object.keys(columns).reduce((previewSchema, key) => {
        if ((config.listenerFields || []).includes(columns[key].fieldName)) {
          previewSchema[key] = {
            ...columns[key],
            fixed: false,
            width: undefined,
          };
        }
        if (columns[key].fieldName === fieldName) {
          previewSchema[key] = {
            ...columns[key],
            config,
            fixed: true,
          };
        }
        return previewSchema;
      }, {} as { [key: string]: ColumnConfig }),
    };
  }, [config, fieldName, tableSchema]);

  return (
    <Stack spacing={1}>
      <Grid container direction="row" spacing={2} flexWrap="nowrap">
        <Grid item xs={12} md={6}>
          <MultiSelect
            label="Listener fields"
            options={tableColumnsOrdered
              .filter((c) => listenerFieldTypes.includes(c.type))
              .map((c) => ({ label: c.name, value: c.key }))}
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
            options={outputFieldTypes}
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

      <InputLabel>Formula script</InputLabel>
      <div>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyItems="space-between"
          justifyContent="space-between"
          marginBottom={1}
        >
          <Typography variant="body2" color="textSecondary">
            Available:
          </Typography>
          <Grid
            container
            spacing={1}
            style={{ flexGrow: 1, marginTop: -8, marginLeft: 0 }}
          >
            <Grid item>
              <Tooltip title="Current row's data">
                <code>row</code>
              </Tooltip>
            </Grid>
          </Grid>
        </Stack>
        <Suspense fallback={<FieldSkeleton height={200} />}>
          <CodeEditor
            diagnosticsOptions={diagnosticsOptions}
            value={formulaFn}
            extraLibs={[
              formulaDefs.replace(
                `"PLACEHOLDER_OUTPUT_TYPE"`,
                `${returnType} | Promise<${returnType}>`
              ),
            ]}
            onChange={useDebouncedCallback(onChange("formulaFn"), 300)}
          />
        </Suspense>
      </div>
      <PreviewTable tableSchema={previewTableSchema} />
    </Stack>
  );
}

export const settingsValidator = (config: any) => {
  const errors: Record<string, any> = {};
  if (config.error) errors.error = config.error;
  return errors;
};
