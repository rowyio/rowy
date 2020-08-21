import React, { lazy } from "react";
import { useForm } from "react-hook-form";
import _isFunction from "lodash/isFunction";
import _isEmpty from "lodash/isEmpty";

// import { useFiretableContext } from "contexts/firetableContext";

import { Grid } from "@material-ui/core";

import Autosave from "./Autosave";
import FieldWrapper from "./FieldWrapper";
import Text from "./Fields/Text";

import { FieldType } from "constants/fields";

const Url = lazy(() =>
  import("./Fields/Url" /* webpackChunkName: "SideDrawer-Url" */)
);
const SingleSelect = lazy(() =>
  import(
    "./Fields/SingleSelect" /* webpackChunkName: "SideDrawer-SingleSelect" */
  )
);
const MultiSelect = lazy(() =>
  import(
    "./Fields/MultiSelect" /* webpackChunkName: "SideDrawer-MultiSelect" */
  )
);
const DatePicker = lazy(() =>
  import("./Fields/DatePicker" /* webpackChunkName: "SideDrawer-DatePicker" */)
);
const DateTimePicker = lazy(() =>
  import(
    "./Fields/DateTimePicker" /* webpackChunkName: "SideDrawer-DateTimePicker" */
  )
);
const Checkbox = lazy(() =>
  import("./Fields/Checkbox" /* webpackChunkName: "SideDrawer-Checkbox" */)
);
const Rating = lazy(() =>
  import("./Fields/Rating" /* webpackChunkName: "SideDrawer-Rating" */)
);
const Percentage = lazy(() =>
  import("./Fields/Percentage" /* webpackChunkName: "SideDrawer-Percentage" */)
);
const Color = lazy(() =>
  import("./Fields/Color" /* webpackChunkName: "SideDrawer-Color" */)
);
const Slider = lazy(() =>
  import("./Fields/Slider" /* webpackChunkName: "SideDrawer-Slider" */)
);
const ImageUploader = lazy(() =>
  import(
    "./Fields/ImageUploader" /* webpackChunkName: "SideDrawer-ImageUploader" */
  )
);
const FileUploader = lazy(() =>
  import(
    "./Fields/FileUploader" /* webpackChunkName: "SideDrawer-FileUploader" */
  )
);
const RichText = lazy(() =>
  import("./Fields/RichText" /* webpackChunkName: "SideDrawer-RichText" */)
);
const JsonEditor = lazy(() =>
  import("./Fields/JsonEditor" /* webpackChunkName: "SideDrawer-JsonEditor" */)
);
const ConnectTable = lazy(() =>
  import(
    "./Fields/ConnectTable" /* webpackChunkName: "SideDrawer-ConnectTable" */
  )
);
const Code = lazy(() =>
  import("./Fields/Code" /* webpackChunkName: "SideDrawer-Code" */)
);
const SubTable = lazy(() =>
  import("./Fields/SubTable" /* webpackChunkName: "SideDrawer-SubTable" */)
);
const Action = lazy(() =>
  import("./Fields/Action" /* webpackChunkName: "SideDrawer-Action" */)
);

export type Values = { [key: string]: any };
export type Field = {
  type?: FieldType;
  name: string;
  label?: string;
  [key: string]: any;
};
export type Fields = (Field | ((values: Values) => Field))[];

const initializeValue = type => {
  switch (type) {
    case FieldType.singleSelect:
    case FieldType.multiSelect:
    case FieldType.image:
    case FieldType.file:
      return [];
    case FieldType.date:
    case FieldType.dateTime:
      return null;

    case FieldType.checkbox:
      return false;

    case FieldType.number:
      return 0;

    case FieldType.json:
      return {};

    case FieldType.shortText:
    case FieldType.longText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.code:
    case FieldType.richText:
    default:
      break;
  }
};

const getInitialValues = (fields: Fields): Values =>
  fields.reduce((acc, _field) => {
    const field = _isFunction(_field) ? _field({}) : _field;
    if (!field.name) return acc;
    let _type = field.type;
    if (field.config && field.config.renderFieldType) {
      _type = field.config.renderFieldType;
    }
    const value = initializeValue(_type);

    return { ...acc, [field.name]: value };
  }, {});

export interface IFormProps {
  fields: Fields;
  values: Values;
}

export default function Form({ fields, values }: IFormProps) {
  const initialValues = getInitialValues(fields);
  const { ref: docRef, ...rowValues } = values;
  const defaultValues = { ...initialValues, ...rowValues };

  const { register, control } = useForm({
    mode: "onBlur",
    defaultValues,
  });

  // Update field values when Firestore document updates
  // useEffect(() => {
  //   console.log("RESET", defaultValues);
  //   reset(defaultValues);
  // }, [reset, JSON.stringify(rowValues)]);

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
        defaultValues={defaultValues}
        docRef={docRef}
      />

      <Grid container spacing={4} direction="column" wrap="nowrap">
        {fields.map((_field, i) => {
          // Call the field function with values if necessary
          // Otherwise, just use the field object
          const field: Field = _isFunction(_field) ? _field(values) : _field;
          const { type, ...fieldProps } = field;
          let _type = type;

          // Derivative field support
          if (field.config && field.config.renderFieldType) {
            _type = field.config.renderFieldType;
          }

          let renderedField: React.ReactNode = null;

          switch (_type) {
            case FieldType.shortText:
            case FieldType.longText:
            case FieldType.email:
            case FieldType.phone:
            case FieldType.number:
              renderedField = (
                <Text {...fieldProps} control={control} docRef={docRef} />
              );
              break;

            case FieldType.url:
              renderedField = <Url {...fieldProps} control={control} />;
              break;

            case FieldType.singleSelect:
              renderedField = (
                <SingleSelect {...fieldProps} control={control} />
              );
              break;

            case FieldType.multiSelect:
              renderedField = <MultiSelect {...fieldProps} control={control} />;
              break;

            case FieldType.date:
              renderedField = <DatePicker {...fieldProps} control={control} />;
              break;

            case FieldType.dateTime:
              renderedField = (
                <DateTimePicker {...fieldProps} control={control} />
              );
              break;

            case FieldType.checkbox:
              renderedField = <Checkbox {...fieldProps} control={control} />;
              break;

            case FieldType.color:
              renderedField = <Color {...fieldProps} control={control} />;
              break;

            case FieldType.slider:
              renderedField = <Slider {...fieldProps} control={control} />;
              break;

            case FieldType.richText:
              renderedField = <RichText {...fieldProps} control={control} />;
              break;

            case FieldType.image:
              renderedField = (
                <ImageUploader
                  {...fieldProps}
                  control={control}
                  docRef={values.ref}
                />
              );
              break;

            case FieldType.file:
              renderedField = (
                <FileUploader
                  {...fieldProps}
                  control={control}
                  docRef={values.ref}
                />
              );
              break;

            case FieldType.rating:
              renderedField = <Rating {...fieldProps} control={control} />;
              break;

            case FieldType.percentage:
              renderedField = <Percentage {...fieldProps} control={control} />;
              break;

            case FieldType.connectTable:
              renderedField = (
                <ConnectTable {...fieldProps} control={control} />
              );
              break;

            case FieldType.subTable:
              renderedField = (
                <SubTable
                  {...(fieldProps as any)}
                  control={control}
                  docRef={docRef}
                />
              );
              break;

            case FieldType.action:
              renderedField = (
                <Action
                  {...(fieldProps as any)}
                  control={control}
                  docRef={docRef}
                />
              );
              break;

            case FieldType.json:
              renderedField = <JsonEditor {...fieldProps} control={control} />;
              break;

            case FieldType.code:
              renderedField = <Code {...fieldProps} control={control} />;
              break;

            case undefined:
              // default:
              return null;

            default:
              break;
          }

          return (
            <FieldWrapper
              key={fieldProps.name ?? i}
              type={_type}
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
    </form>
  );
}
