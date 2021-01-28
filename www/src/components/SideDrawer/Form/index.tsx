import React from "react";
import { useForm } from "react-hook-form";
import _sortBy from "lodash/sortBy";
import _isEmpty from "lodash/isEmpty";

import { Grid } from "@material-ui/core";

import { Values } from "./utils";
import { getFieldProp } from "components/fields";
import { IFieldConfig } from "components/fields/types";
import Autosave from "./Autosave";
import Reset from "./Reset";
import FieldWrapper from "./FieldWrapper";

import { useAppContext } from "contexts/AppContext";
import { useFiretableContext } from "contexts/FiretableContext";

export interface IFormProps {
  values: Values;
}

export default function Form({ values }: IFormProps) {
  const { tableState } = useFiretableContext();
  const { userDoc } = useAppContext();
  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[`${tableState!.tablePath}`]?.hiddenFields ?? [];

  const fields = _sortBy(Object.values(tableState!.columns), "index").filter(
    (f) => !userDocHiddenFields.includes(f.name)
  );

  // Get initial values from fields config. This won’t be written to the db
  // when the SideDrawer is opened. Only dirty fields will be written
  const initialValues = fields.reduce(
    (a, { key, type }) => ({ ...a, [key]: getFieldProp("initialValue", type) }),
    {}
  );
  const { ref: docRef, ...rowValues } = values;
  const defaultValues = { ...initialValues, ...rowValues };

  const { control, reset, formState, getValues } = useForm({
    mode: "onBlur",
    defaultValues,
  });

  // const { sideDrawerRef } = useFiretableContext();
  // useEffect(() => {
  //   const column = sideDrawerRef?.current?.cell?.column;
  //   if (!column) return;

  //   const elem = document.getElementById(`sidedrawer-label-${column}`)
  //     ?.parentNode as HTMLElement;

  //   // Time out for double-clicking on cells, which can open the null editor
  //   setTimeout(() => elem?.scrollIntoView({ behavior: "smooth" }), 200);
  // }, [sideDrawerRef?.current]);

  return (
    <form>
      <Autosave
        control={control}
        docRef={docRef}
        row={values}
        reset={reset}
        formState={formState}
      />

      <Reset
        formState={formState}
        reset={reset}
        defaultValues={defaultValues}
        getValues={getValues}
      />

      <Grid container spacing={4} direction="column" wrap="nowrap">
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

          return (
            <FieldWrapper
              key={field.key ?? i}
              type={field.type}
              name={field.key}
              label={field.name}
              disabled={field.editable === false}
            >
              {React.createElement(fieldComponent, {
                column: field,
                control,
                docRef,
                disabled: field.editable === false,
              })}
            </FieldWrapper>
          );
        })}

        <FieldWrapper
          type="debug"
          name="_ft_debug_path"
          label="Document Path"
          debugText={values.ref?.path ?? values.id ?? "No ref"}
        />
      </Grid>
    </form>
  );
}
