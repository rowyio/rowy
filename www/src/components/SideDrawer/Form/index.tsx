import React from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import _isFunction from "lodash/isFunction";
import _isEmpty from "lodash/isEmpty";

import { Grid } from "@material-ui/core";

import Autosave from "./Autosave";
import FieldWrapper from "./FieldWrapper";
import Text from "./Fields/Text";
import SingleSelect from "./Fields/SingleSelect";
import MultiSelect from "./Fields/MultiSelect";
import DatePicker from "./Fields/DatePicker";
import DateTimePicker from "./Fields/DateTimePicker";
import Checkbox from "./Fields/Checkbox";
import Rating from "./Fields/Rating";
import Color from "./Fields/Color";
// import Radio from "./Fields/Radio";
import Slider from "./Fields/Slider";
// import TextMulti from "./Fields/TextMulti";
// import ImageUploader from "./Fields/ImageUploader";

import { FieldType } from "constants/fields";
// import Heading from "./Heading";
// import Description from "./Description";

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

                  // case FieldType.richText:
                  //   break;

                  // case FieldType.image:
                  //   renderedField = (
                  //     <Field
                  //       {...fieldProps}
                  //       component={ImageUploader}
                  //       docRef={docState.ref}
                  //     />
                  //   );
                  //   break;

                  case FieldType.rating:
                    renderedField = (
                      <Field {...fieldProps} component={Rating} />
                    );
                    break;

                  // case FieldType.file:
                  // case FieldType.connectTable:
                  // case FieldType.subTable:
                  // case FieldType.action:
                  // case FieldType.json:

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
            </Grid>
          </FormikForm>
        )}
      </Formik>
    </MuiPickersUtilsProvider>
  );
}
