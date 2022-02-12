import _find from "lodash/find";
import { Typography } from "@mui/material";
import { Field, FieldType } from "@rowy/form-builder";

export const conditionSettings = (conditions?: any, editIndex?: number) => {
  function setDefaultValue(type: any, conditions: any, index: any) {
    if (!index) return null;
    console.log("breaking", conditions);
    console.log("index", index, "type", type);
    const editCondition = conditions[index];
    const fieldTypeValue = editCondition[type];
    return fieldTypeValue;
  }

  /**
   *
   * @param index from modal conditions list, when editing a modal this is a num
   * @param value from validation, watching current field type
   * @param conditions
   * @returns
   */
  function setValidation(index, value, conditions) {
    let result;
    if (!index) result = !_find(conditions, { value: value });
    else {
      const copyConditions = [...conditions];
      copyConditions.splice(index, 1); // remove curr condition from condition list
      result = !_find(copyConditions, { value: value });
    }
    return result;
  }

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
      labelPlural: "sections",
      options: [
        { label: "Boolean", value: "boolean" },
        { label: "Number", value: "number" },
        { label: "String", value: "string" },
        { label: "Undefined", value: "undefined" },
        { label: "Null", value: "null" },
      ],
      multiple: false,
      defaultValue: setDefaultValue("type", conditions, editIndex) ?? "null",
      freeText: true,
    },
    {
      type: FieldType.singleSelect,
      name: "value",
      multiple: false,
      options: [
        { label: "False", value: false },
        { label: "True", value: true },
      ],
      defaultValue: false,
      displayCondition: 'return values.type==="boolean"',
      label: "Select condition value",
      required: true,
      minRows: 2,
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
      displayCondition: 'return values.type==="number"',
      defaultValue: setDefaultValue("operator", conditions, editIndex) ?? "==",
      label: "Select operator",
      minRows: 2,
    },
    {
      type: FieldType.shortText,
      format: "number",
      name: "value",
      multiple: false,
      defaultValue: setDefaultValue("value", conditions, editIndex) ?? 0,
      displayCondition: 'return values.type==="number"',
      label: "Value",
      minRows: 2,
      watchedField: "number",
    },
    {
      type: FieldType.shortText,
      name: "value",
      label: "Value",
      displayCondition: 'return values.type==="string"',
      defaultValue: setDefaultValue("value", conditions, editIndex) ?? "",
      minRows: 2,
      validation: [
        [
          "test",
          "duplicate-value",
          "Value already exist",
          (value) => setValidation(editIndex, value, conditions),
        ],
      ],
    },
    {
      type: FieldType.shortText,
      name: "label",
      label: "Label (optional)",
      defaultValue: setDefaultValue("label", conditions, editIndex) ?? "",
      minRows: 2,
    },
  ] as Field[];
};
