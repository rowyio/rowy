import { lazy, Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ISettingsProps } from "@src/components/fields/types";
import {
  Grid,
  InputLabel,
  Typography,
  Stack,
  FormHelperText,
} from "@mui/material";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";

import { useAtom } from "jotai";
import {
  tableColumnsOrderedAtom,
  tableRowsAtom,
  tableScope,
} from "@src/atoms/tableScope";
import { useFormula } from "./useFormula";
import { listenerFieldTypes, outputFieldTypes, typeDefs } from "./util";
import MultiSelect from "@rowy/multiselect";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

export default function Settings({
  config,
  fieldName,
  onChange,
  onBlur,
  errors,
}: ISettingsProps) {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const { error, result, loading } = useFormula({
    row: tableRows[0],
    formulaFn: config.formulaFn,
  });

  // if (error && !config?.error) {
  //   onChange("error")(error.message);
  // }
  // if (!error && config?.error) {
  //   onChange("error")(undefined);
  // }

  // if (loading) {
  //   console.log("loading");
  // }

  // if (error) {
  //   console.log(error);
  // }

  const formulaFn =
    config?.formulaFn ??
    `// Write your formula code here
// for example:
// return column1 + column2;
// checkout the documentation for more info: https://docs.rowy.io/field-types/formula`;

  return (
    <Stack spacing={1}>
      <Grid container direction="row" spacing={2} flexWrap="nowrap">
        <Grid item xs={12} md={6}>
          <MultiSelect
            label="Listener fields"
            options={tableColumnsOrdered
              .filter((c) => listenerFieldTypes.includes(c.type))
              .map((c) => c.name)}
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
            {/* {Object.values(previewColumns).map((column) => (
              <Grid item key={column.key}>
                <Tooltip title={column.type}>
                  <code>{column.fieldName}</code>
                </Tooltip>
              </Grid>
            ))} */}
          </Grid>
        </Stack>
        <Suspense fallback={<FieldSkeleton height={200} />}>
          <CodeEditor
            value={formulaFn}
            // extraLibs={[defs]}
            onChange={useDebouncedCallback(onChange("formulaFn"), 300)}
          />
        </Suspense>
      </div>
      {/* <InputLabel style={{ overflowX: "scroll", display: "initial" }}>
        Preview:
        <Grid container wrap="nowrap" style={{ flexGrow: 1 }}>
          <ColumnWrapper item>
            <Column label={fieldName} type={FieldType.formula} />
            <Cell
              key={`${fieldName}--${tableRows[0]._rowy_ref.path}`}
              field={fieldName}
              value={String(result)}
              type={FieldType.shortText}
              name={fieldName}
            />
          </ColumnWrapper>
          {Object.entries(previewColumns).map(
            ([field, { name, type, key }]) => (
              <ColumnWrapper>
                <Column label={name} type={type} />
                <Cell
                  key={`${field}--${tableRows[0]._rowy_ref.path}`}
                  field={field}
                  value={key === fieldName ? String(result) : tableRows[0][key]}
                  type={key === fieldName ? FieldType.shortText : type}
                  name={name}
                />
              </ColumnWrapper>
            )
          )}
        </Grid>
      </InputLabel> */}
    </Stack>
  );
}

export const settingsValidator = (config: any) => {
  const errors: Record<string, any> = {};
  if (config.error) errors.error = config.error;
  return errors;
};
