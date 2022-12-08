import { lazy, Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ISettingsProps } from "@src/components/fields/types";
import {
  Grid,
  InputLabel,
  Typography,
  Stack,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";

import { useAtom } from "jotai";
import { tableColumnsOrderedAtom, tableScope } from "@src/atoms/tableScope";
import { defaultFn, listenerFieldTypes, outputFieldTypes } from "./util";
import MultiSelect from "@rowy/multiselect";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";
import { getFieldProp } from "..";

/* eslint-disable import/no-webpack-loader-syntax */
import formulaDefs from "!!raw-loader!./formula.d.ts";

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

export default function Settings({
  config,
  onChange,
  onBlur,
  errors,
}: ISettingsProps) {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const returnType = getFieldProp("dataType", config.renderFieldType) ?? "any";
  const formulaFn = config?.formulaFn ? config.formulaFn : defaultFn;

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
    </Stack>
  );
}

export const settingsValidator = (config: any) => {
  const errors: Record<string, any> = {};
  if (config.error) errors.error = config.error;
  return errors;
};
