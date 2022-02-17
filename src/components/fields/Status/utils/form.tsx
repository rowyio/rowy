import { Typography } from "@mui/material";
import { Field, FieldType } from "@rowy/form-builder";
import { setDefaultValue } from "./defaultValueHelpr";
import {
  setBooleanValidation,
  setDataTypeValidation,
  setLabelValidation,
  setValueValidation,
} from "./validationHelper";

export const conditionSettings = (conditions?: any, editIndex?: number) => {
  return [
    {
      type: FieldType.singleSelect,
      name: "type",
      label: (
        <>
          <Typography variant="overline">DATA TYPE (input)</Typography>
          <br />
        </>
      ),
      assistiveText: "Selected Data Type",
      options: [
        { label: "Null", value: "null" },
        { label: "Undefined", value: "undefined" },
        { label: "Boolean", value: "boolean" },
        { label: "Number", value: "number" },
        { label: "String", value: "string" },
      ],
      multiple: false,
      defaultValue: setDefaultValue("null", "type", conditions, editIndex),
      freeText: false,
      validation: [
        [
          "test",
          "duplicate-falsey",
          "Falsy already exist",
          (value) => setDataTypeValidation(editIndex, value, conditions),
        ],
      ],
    },
    {
      type: FieldType.singleSelect,
      name: "boolean",
      assistiveText: "Selected boolean type",
      options: [
        { label: "False", value: "false" },
        { label: "True", value: "true" },
      ],
      multiple: false,
      defaultValue: setDefaultValue("false", "value", conditions, editIndex),
      displayCondition: 'return values.type==="boolean"',
      freeText: false,
      validation: [
        [
          "test",
          "duplicate-boolean",
          "Boolean already exist",
          (value) => setBooleanValidation(editIndex, value, conditions),
        ],
      ],
    },
    {
      type: FieldType.singleSelect,
      name: "operator",
      multiple: false,
      options: [
        { label: "Less than", value: "<" },
        { label: "Less than or equal", value: "<=" },
        { label: "Equal", value: "==" },
        { label: "Equal or more than", value: ">=" },
        { label: "More than", value: ">" },
      ],
      defaultValue: setDefaultValue("==", "operator", conditions, editIndex),
      displayCondition: 'return values.type==="number"',
      label: "Select operator",
      minRows: 2,
    },
    {
      type: FieldType.shortText,
      format: "number",
      name: "number",
      multiple: false,
      defaultValue: setDefaultValue(0, "value", conditions, editIndex),
      displayCondition: 'return values.type==="number"',
      label: "Value",
      minRows: 2,
      //TODO validation by watching value of operator field and number field and comparing agaisnt existing value
    },
    {
      type: FieldType.shortText,
      name: "string",
      label: "Value",
      displayCondition: 'return values.type==="string"',
      defaultValue: setDefaultValue("", "value", conditions, editIndex),
      minRows: 2,
      validation: [
        [
          "test",
          "duplicate-value",
          "Value already exist",
          (value) => setValueValidation(editIndex, value, conditions),
        ],
      ],
    },
    {
      type: FieldType.shortText,
      name: "label",
      label: "Label (optional)",
      defaultValue: setDefaultValue("", "label", conditions, editIndex),
      minRows: 2,
      validation: [
        [
          "test",
          "duplicate-label",
          "Label already exist",
          (label) => setLabelValidation(editIndex, label, conditions),
        ],
      ],
    },
  ] as Field[];
};
