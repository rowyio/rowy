import { lazy, Suspense, useEffect } from "react";
import { ISettingsProps } from "@src/components/fields/types";
import { useAtom, useSetAtom } from "jotai";

import { Grid, InputLabel, FormHelperText } from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";

import {
  projectScope,
  compatibleRowyRunVersionAtom,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { tableScope, tableColumnsOrderedAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { WIKI_LINKS } from "@src/constants/externalLinks";

import { getFieldProp } from "@src/components/fields";
import derivativeDefs from "./derivative.d.ts?raw";

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
  onChange,
  fieldName,
  onBlur,
  errors,
}: ISettingsProps) {
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  useEffect(() => {
    if (!projectSettings.rowyRunUrl)
      openRowyRunModal({ feature: "Derivative fields" });
  }, [projectSettings.rowyRunUrl]);

  const returnType = getFieldProp("dataType", config.renderFieldType) ?? "any";
  const columnOptions = tableColumnsOrdered
    .filter((column) => column.fieldName !== fieldName)
    .filter((column) => column.type !== FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));

  const functionBodyOnly = compatibleRowyRunVersion!({ maxVersion: "1.3.10" });
  const derivativeFn = functionBodyOnly
    ? config?.script
    : config.derivativeFn
    ? config.derivativeFn
    : config?.script
    ? `const derivative:Derivative = async ({row,ref,db,storage,auth,logging})=>{
  logging.log("derivative started")
  
  // Import any NPM package needed
  // const lodash = require('lodash');
  
  ${config.script.replace(/utilFns.getSecret/g, "rowy.secrets.get")}
}`
    : `// Import any NPM package needed
// import _ from "lodash";

const derivative: Derivative = async ({ row, ref, db, storage, auth, logging }) => {
  logging.log("derivative started");

  // Example:
  // const sum = row.a + row.b;
  // return sum;
};

export default derivative;
`;

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
        <CodeEditorHelper
          docLink={WIKI_LINKS.fieldTypesDerivative}
          additionalVariables={[
            {
              key: "row",
              description: `row has the value of doc.data() it has type definitions using this table's schema, but you can access any field in the document.`,
            },
            {
              key: "ref",
              description: `reference object that represents the reference to the current row in firestore db (ie: doc.ref).`,
            },
          ]}
        />
        <Suspense fallback={<FieldSkeleton height={200} />}>
          <CodeEditor
            diagnosticsOptions={
              functionBodyOnly ? undefined : diagnosticsOptions
            }
            value={derivativeFn}
            extraLibs={[
              derivativeDefs.replace(
                `"PLACEHOLDER_OUTPUT_TYPE"`,
                `${returnType} | Promise<${returnType}>`
              ),
            ]}
            onChange={onChange(functionBodyOnly ? "script" : "derivativeFn")}
          />
        </Suspense>
      </div>
    </>
  );
}

export const settingsValidator = (config: any) => {
  const errors: Record<string, any> = {};
  if (!config.listenerFields) errors.listenerFields = "Required";
  if (!config.renderFieldType) errors.renderFieldType = "Required";
  return errors;
};
