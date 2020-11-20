import React, { lazy } from "react";
import { useForm } from "react-hook-form";
import _isFunction from "lodash/isFunction";
import _isEmpty from "lodash/isEmpty";

import { Grid } from "@material-ui/core";

import { Fields, Values, getInitialValues, Field } from "./utils";
import { FieldType } from "constants/fields";
import Autosave from "./Autosave";
import FieldWrapper from "./FieldWrapper";

import { useAppContext } from "contexts/AppContext";
import { useFiretableContext } from "contexts/FiretableContext";

import Text from "./Fields/Text";
const Url = lazy(
  () => import("./Fields/Url" /* webpackChunkName: "SideDrawer-Url" */)
);
const SingleSelect = lazy(
  () =>
    import(
      "./Fields/SingleSelect" /* webpackChunkName: "SideDrawer-SingleSelect" */
    )
);
const MultiSelect = lazy(
  () =>
    import(
      "./Fields/MultiSelect" /* webpackChunkName: "SideDrawer-MultiSelect" */
    )
);
const DatePicker = lazy(
  () =>
    import(
      "./Fields/DatePicker" /* webpackChunkName: "SideDrawer-DatePicker" */
    )
);
const DateTimePicker = lazy(
  () =>
    import(
      "./Fields/DateTimePicker" /* webpackChunkName: "SideDrawer-DateTimePicker" */
    )
);
const Checkbox = lazy(
  () =>
    import("./Fields/Checkbox" /* webpackChunkName: "SideDrawer-Checkbox" */)
);
const Rating = lazy(
  () => import("./Fields/Rating" /* webpackChunkName: "SideDrawer-Rating" */)
);
const Percentage = lazy(
  () =>
    import(
      "./Fields/Percentage" /* webpackChunkName: "SideDrawer-Percentage" */
    )
);
const Color = lazy(
  () => import("./Fields/Color" /* webpackChunkName: "SideDrawer-Color" */)
);
const Slider = lazy(
  () => import("./Fields/Slider" /* webpackChunkName: "SideDrawer-Slider" */)
);
const ImageUploader = lazy(
  () =>
    import(
      "./Fields/ImageUploader" /* webpackChunkName: "SideDrawer-ImageUploader" */
    )
);
const FileUploader = lazy(
  () =>
    import(
      "./Fields/FileUploader" /* webpackChunkName: "SideDrawer-FileUploader" */
    )
);
const RichText = lazy(
  () =>
    import("./Fields/RichText" /* webpackChunkName: "SideDrawer-RichText" */)
);
const JsonEditor = lazy(
  () =>
    import(
      "./Fields/JsonEditor" /* webpackChunkName: "SideDrawer-JsonEditor" */
    )
);
const ConnectTable = lazy(
  () =>
    import(
      "./Fields/ConnectTable" /* webpackChunkName: "SideDrawer-ConnectTable" */
    )
);
const ConnectService = lazy(
  () =>
    import(
      "./Fields/ConnectService" /* webpackChunkName: "SideDrawer-ConnectTable" */
    )
);
const Code = lazy(
  () => import("./Fields/Code" /* webpackChunkName: "SideDrawer-Code" */)
);
const SubTable = lazy(
  () =>
    import("./Fields/SubTable" /* webpackChunkName: "SideDrawer-SubTable" */)
);
const Action = lazy(
  () => import("./Fields/Action" /* webpackChunkName: "SideDrawer-Action" */)
);
const Id = lazy(
  () => import("./Fields/Id" /* webpackChunkName: "SideDrawer-Id" */)
);
const User = lazy(
  () => import("./Fields/User" /* webpackChunkName: "SideDrawer-User" */)
);

export interface IFormProps {
  fields: Fields;
  values: Values;
}

export default function Form({ fields, values }: IFormProps) {
  const initialValues = getInitialValues(fields);
  const { ref: docRef, ...rowValues } = values;
  const defaultValues = { ...initialValues, ...rowValues };

  const { tableState } = useFiretableContext();
  const { userDoc } = useAppContext();
  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[`${tableState?.tablePath}`]?.hiddenFields ?? [];

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
        row={values}
      />

      <Grid container spacing={4} direction="column" wrap="nowrap">
        {fields
          .filter((f) => !userDocHiddenFields.includes(f.name))
          .map((_field, i) => {
            // Call the field function with values if necessary
            // Otherwise, just use the field object
            const field: Field = _isFunction(_field) ? _field(values) : _field;
            const { type, ...fieldProps } = field;
            let _type = type;

            // Derivative/aggregate field support
            if (field.config && field.config.renderFieldType) {
              _type = field.config.renderFieldType;
            }

            let fieldComponent: React.ComponentType<any> | null = null;

            switch (_type) {
              case FieldType.shortText:
              case FieldType.longText:
              case FieldType.email:
              case FieldType.phone:
              case FieldType.number:
                fieldComponent = Text;
                break;

              case FieldType.url:
                fieldComponent = Url;
                break;

              case FieldType.singleSelect:
                fieldComponent = SingleSelect;
                break;

              case FieldType.multiSelect:
                fieldComponent = MultiSelect;
                break;

              case FieldType.date:
                fieldComponent = DatePicker;
                break;

              case FieldType.dateTime:
                fieldComponent = DateTimePicker;
                break;

              case FieldType.checkbox:
                fieldComponent = Checkbox;
                break;

              case FieldType.color:
                fieldComponent = Color;
                break;

              case FieldType.slider:
                fieldComponent = Slider;
                break;

              case FieldType.richText:
                fieldComponent = RichText;
                break;

              case FieldType.image:
                fieldComponent = ImageUploader;
                break;

              case FieldType.file:
                fieldComponent = FileUploader;
                break;

              case FieldType.rating:
                fieldComponent = Rating;
                break;

              case FieldType.percentage:
                fieldComponent = Percentage;
                break;

              case FieldType.connectTable:
                fieldComponent = ConnectTable;
                break;

              case FieldType.connectService:
                fieldComponent = ConnectService;
                break;

              case FieldType.subTable:
                fieldComponent = SubTable;
                break;

              case FieldType.action:
                fieldComponent = Action;
                break;

              case FieldType.json:
                fieldComponent = JsonEditor;
                break;

              case FieldType.code:
                fieldComponent = Code;
                break;

              case FieldType.id:
                fieldComponent = Id;
                break;

              case FieldType.user:
                fieldComponent = User;
                break;

              case undefined:
                // default:
                return null;

              default:
                break;
            }

            // Should not reach this state
            if (fieldComponent === null) {
              console.error("`fieldComponent` is null", field);
              return null;
            }

            return (
              <FieldWrapper
                key={fieldProps.name ?? i}
                type={_type}
                name={field.name}
                label={field.label}
              >
                {React.createElement(fieldComponent, {
                  ...fieldProps,
                  control,
                  docRef,
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
