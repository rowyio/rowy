import { lazy, Suspense, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Provider, useAtom } from "jotai";
import MultiSelect from "@rowy/multiselect";

import { Grid, InputLabel, Stack, FormHelperText, Box } from "@mui/material";

import {
  tableColumnsOrderedAtom,
  tableRowsDbAtom,
  tableSchemaAtom,
  tableScope,
  tableSettingsAtom,
  updateFieldAtom,
} from "@src/atoms/tableScope";

import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import { ISettingsProps } from "@src/components/fields/types";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";
import { DEFAULT_COL_WIDTH, DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import { ColumnConfig } from "@src/types/table";

import {
  defaultFn,
  listenerFieldTypes,
  outputFieldTypes,
  serializeRef,
} from "./util";
import PreviewTable from "./PreviewTable";
import { getFieldProp } from "..";

import formulaDefs from "./formula.d.ts?raw";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import { currentUserAtom } from "@src/atoms/projectScope";
import TableSourcePreview from "./TableSourcePreview";

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
  const [currentUser] = useAtom(currentUserAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
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
            width: DEFAULT_COL_WIDTH,
            editable: true,
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
      rowHeight: DEFAULT_ROW_HEIGHT,
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
        <CodeEditorHelper
          disableDefaultVariables
          disableSecretManagerLink
          disableCloudManagerLink
          docLink={WIKI_LINKS.fieldTypesFormula}
          additionalVariables={[
            {
              key: "row",
              description: `row has the value of doc.data() it has type definitions using this table's schema, but you can only access formula's listener fields.`,
            },
            {
              key: "ref",
              description: `reference object that holds the readonly reference of the row document.(i.e ref.id)`,
            },
          ]}
        />
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
      <Box>
        <InputLabel>Preview table</InputLabel>
        <Provider
          key={"preview-table"}
          scope={tableScope}
          initialValues={[
            [currentUserAtom, currentUser],
            [tableSchemaAtom, previewTableSchema],
            [tableSettingsAtom, tableSettings],
          ]}
        >
          <TableSourcePreview formulaFn={formulaFn} />
          <PreviewTable />
        </Provider>
      </Box>
    </Stack>
  );
}

export const settingsValidator = (config: any) => {
  const errors: Record<string, any> = {};
  if (config.error) errors.error = config.error;
  return errors;
};
