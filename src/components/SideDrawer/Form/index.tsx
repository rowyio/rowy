import { createElement, useEffect } from "react";
import { useForm } from "react-hook-form";
import _sortBy from "lodash/sortBy";
import _isEmpty from "lodash/isEmpty";
import _set from "lodash/set";
import createPersistedState from "use-persisted-state";

import { Stack, FormControlLabel, Switch } from "@mui/material";

import { Values } from "./utils";
import { getFieldProp } from "@src/components/fields";
import { IFieldConfig } from "@src/components/fields/types";
import Autosave from "./Autosave";
import Reset from "./Reset";
import FieldWrapper from "./FieldWrapper";

import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { sanitizeFirestoreRefs } from "@src/utils/fns";

const useSideDrawerShowHiddenFieldsState = createPersistedState(
  "__ROWY__SIDE_DRAWER_SHOW_HIDDEN_FIELDS"
);

export interface IFormProps {
  values: Values;
}

export default function Form({ values }: IFormProps) {
  const { userDoc, userClaims } = useAppContext();
  const { table, tableState, sideDrawerRef } = useProjectContext();

  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[`${tableState!.config.id}`]?.hiddenFields ?? [];

  const [showHiddenFields, setShowHiddenFields] =
    useSideDrawerShowHiddenFieldsState(false);

  const fields = showHiddenFields
    ? _sortBy(Object.values(tableState!.columns), "index")
    : _sortBy(Object.values(tableState!.columns), "index").filter(
        (f) => !userDocHiddenFields.includes(f.key)
      );

  // Get initial values from fields config. This won’t be written to the db
  // when the SideDrawer is opened. Only dirty fields will be written
  const initialValues = fields.reduce(
    (a, { key, type }) => {
      const initialValue = getFieldProp("initialValue", type);
      const nextValues = { ...a };
      if (key.indexOf('.') !== -1) {
        _set(nextValues, key, initialValue);
      } else {
        nextValues[key] = initialValue;
      }
      return nextValues;
    },
    {}
  );
  const { ref: docRef, ...rowValues } = values;
  const safeRowValues = sanitizeFirestoreRefs(rowValues);
  const defaultValues = { ...initialValues, ...safeRowValues };

  const methods = useForm({ mode: "onBlur", defaultValues });
  const { control, reset, formState, getValues } = methods;
  const { dirtyFields } = formState;

  const column = sideDrawerRef?.current?.cell?.column;
  useEffect(() => {
    if (!column) return;

    const labelElem = document.getElementById(
      `sidedrawer-label-${column}`
    )?.parentElement;
    const fieldElem = document.getElementById(`sidedrawer-field-${column}`);

    // Time out for double-clicking on cells, which can open the null editor
    setTimeout(() => {
      if (labelElem) labelElem.scrollIntoView({ behavior: "smooth" });
      if (fieldElem) fieldElem.focus({ preventScroll: true });
    }, 200);
  }, [column]);

  return (
    <form>
      <Autosave
        control={control}
        docRef={docRef}
        row={values}
        reset={reset}
        dirtyFields={dirtyFields}
      />

      <Reset
        dirtyFields={dirtyFields}
        reset={reset}
        defaultValues={defaultValues}
        getValues={getValues}
      />

      <Stack spacing={3}>
        {fields.map((field, i) => {
          // Derivative/aggregate field support
          let type = field.type;
          if (field.config && field.config.renderFieldType) {
            type = field.config.renderFieldType;
          }

          const fieldComponent: IFieldConfig["SideDrawerField"] = getFieldProp(
            "SideDrawerField",
            type
          );

          // Should not reach this state
          if (_isEmpty(fieldComponent)) {
            // console.error('Could not find SideDrawerField component', field);
            return null;
          }

          // Disable field if locked, or if table is read-only
          const disabled =
            field.editable === false ||
            Boolean(table?.readOnly && !userClaims?.roles.includes("ADMIN"));

          return (
            <FieldWrapper
              key={field.key ?? i}
              type={field.type}
              name={field.key}
              label={field.name}
              disabled={disabled}
            >
              {createElement(fieldComponent, {
                column: field,
                control,
                docRef,
                disabled,
                useFormMethods: methods,
              })}
            </FieldWrapper>
          );
        })}

        <FieldWrapper
          type="debug"
          name="_debug_path"
          label="Document path"
          debugText={values.ref?.path ?? values.id ?? "No ref"}
        />

        {userDocHiddenFields.length > 0 && (
          <FormControlLabel
            label="Show hidden fields"
            control={
              <Switch
                checked={showHiddenFields}
                onChange={(e) => setShowHiddenFields(e.target.checked)}
              />
            }
            sx={{
              borderTop: 1,
              borderColor: "divider",
              pt: 3,
              "& .MuiSwitch-root": { ml: -0.5 },
            }}
          />
        )}
      </Stack>
    </form>
  );
}
