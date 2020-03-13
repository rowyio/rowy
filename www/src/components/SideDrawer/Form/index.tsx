import React, { lazy, useEffect } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import _isFunction from "lodash/isFunction";
import _isEmpty from "lodash/isEmpty";

import { useFiretableContext } from "contexts/firetableContext";

import { Grid } from "@material-ui/core";

import Autosave from "./Autosave";
import FieldWrapper from "./FieldWrapper";
import Text from "./Fields/Text";

import { FieldType } from "constants/fields";

const Percentage = lazy(() => import("./Fields/Percentage"));
const SingleSelect = lazy(() => import("./Fields/SingleSelect"));
const MultiSelect = lazy(() => import("./Fields/MultiSelect"));
const DatePicker = lazy(() => import("./Fields/DatePicker"));
const DateTimePicker = lazy(() => import("./Fields/DateTimePicker"));
const Checkbox = lazy(() => import("./Fields/Checkbox"));
const Rating = lazy(() => import("./Fields/Rating"));
const Color = lazy(() => import("./Fields/Color"));
const Slider = lazy(() => import("./Fields/Slider"));
const ImageUploader = lazy(() => import("./Fields/ImageUploader"));
const FileUploader = lazy(() => import("./Fields/FileUploader"));
const RichText = lazy(() => import("./Fields/RichText"));
const JsonEditor = lazy(() => import("./Fields/JsonEditor"));
const ConnectTable = lazy(() => import("./Fields/ConnectTable"));
const Action = lazy(() => import("./Fields/Action"));

export type Values = { [key: string]: any };
export type Field = {
  type?: FieldType;
  name?: string;
  label?: React.ReactNode;
  [key: string]: any;
};
export type Fields = (Field | ((values: Values) => Field))[];

const getInitialValues = (fields: Fields): Values =>
  fields.reduce((acc, _field) => {
    const field = _isFunction(_field) ? _field({}) : _field;
    if (!field.name) return acc;

    let value: any = "";

    switch (field.type) {
      case FieldType.singleSelect:
      case FieldType.multiSelect:
      case FieldType.image:
      case FieldType.file:
        value = [];
        break;

      case FieldType.date:
      case FieldType.dateTime:
        value = null;
        break;

      case FieldType.checkbox:
        value = false;
        break;

      case FieldType.number:
        value = 0;
        break;

      case FieldType.shortText:
      case FieldType.longText:
      case FieldType.email:
      case FieldType.phone:
      case FieldType.url:
      case FieldType.richText:
      default:
        break;
    }

    return { ...acc, [field.name]: value };
  }, {});

export interface IFormProps {
  fields: Fields;
  values: Values;
}

export default function Form({ fields, values }: IFormProps) {
  const initialValues = getInitialValues(fields);

  const { sideDrawerRef } = useFiretableContext();
  useEffect(() => {
    const column = sideDrawerRef?.current?.cell?.column;
    if (!column) return;

    const elem = document.getElementById(`sidedrawer-label-${column}`)
      ?.parentNode as HTMLElement;

    // Time out for double-clicking on cells, which can open the null editor
    setTimeout(() => elem?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [sideDrawerRef?.current]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Formik
        enableReinitialize
        initialValues={{ ...initialValues, ...values }}
        onSubmit={(values, actions) => {
          // Mark as submitted. We use Autosave instead.
          actions.setSubmitting(false);
        }}
      >
        {({ values, errors }) => (
          <FormikForm>
            <Autosave values={values} errors={errors} />

            <Grid container spacing={4} direction="column" wrap="nowrap">
              {fields.map((_field, i) => {
                // Call the field function with values if necessary
                // Otherwise, just use the field object
                const field: Field = _isFunction(_field)
                  ? _field(values)
                  : _field;
                const { type, ...fieldProps } = field;

                // TODO: handle get initial field value for when a field is later
                // shown to prevent uncontrolled components becoming controlled

                let renderedField: React.ReactNode = null;

                switch (type) {
                  case FieldType.shortText:
                  case FieldType.longText:
                  case FieldType.email:
                  case FieldType.phone:
                  case FieldType.url:
                  case FieldType.number:
                    renderedField = (
                      <Field {...fieldProps} component={Text} hiddenLabel />
                    );
                    break;

                  case FieldType.percentage:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={Percentage}
                        hiddenLabel
                      />
                    );
                    break;

                  case FieldType.singleSelect:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={SingleSelect}
                        hiddenLabel
                      />
                    );
                    break;

                  case FieldType.multiSelect:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={MultiSelect}
                        hiddenLabel
                      />
                    );
                    break;

                  case FieldType.date:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={DatePicker}
                        hiddenLabel
                      />
                    );
                    break;

                  case FieldType.dateTime:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={DateTimePicker}
                        hiddenLabel
                      />
                    );
                    break;

                  case FieldType.checkbox:
                    renderedField = (
                      <Checkbox {...fieldProps} name={fieldProps.name!} />
                    );
                    break;

                  case FieldType.color:
                    renderedField = <Field {...fieldProps} component={Color} />;
                    break;

                  case FieldType.slider:
                    renderedField = (
                      <Field {...fieldProps} component={Slider} />
                    );
                    break;

                  case FieldType.richText:
                    renderedField = (
                      <Field {...fieldProps} component={RichText} />
                    );
                    break;

                  case FieldType.image:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={ImageUploader}
                        docRef={values.ref}
                      />
                    );
                    break;

                  case FieldType.file:
                    renderedField = (
                      <Field
                        {...fieldProps}
                        component={FileUploader}
                        docRef={values.ref}
                      />
                    );
                    break;

                  case FieldType.rating:
                    renderedField = (
                      <Field {...fieldProps} component={Rating} />
                    );
                    break;

                  case FieldType.connectTable:
                    renderedField = (
                      <Field {...fieldProps} component={ConnectTable} />
                    );
                    break;

                  // case FieldType.subTable:

                  case FieldType.action:
                    renderedField = (
                      <Field {...fieldProps} component={Action} />
                    );
                    break;

                  case FieldType.json:
                    renderedField = (
                      <Field {...fieldProps} component={JsonEditor} />
                    );
                    break;

                  case undefined:
                    return null;

                  default:
                    break;
                }

                return (
                  <FieldWrapper
                    key={fieldProps.name ?? i}
                    type={type}
                    name={field.name}
                    label={field.label}
                  >
                    {renderedField}
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
          </FormikForm>
        )}
      </Formik>
    </MuiPickersUtilsProvider>
  );
}
