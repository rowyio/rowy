import * as yup from "yup";
import { FIELDS } from "@antlerengineering/form-builder";

const labelField = {
  type: FIELDS.text,
  name: "label",
  label: "Spark Label",
  validation: yup.string(),
};
const triggerTypes = {
  type: FIELDS.multiSelect,
  name: "triggerTypes",
  label: `Triggers that will run this spark`,
  options: ["create", "update", "delete"],
};
export const newSparkForm = (columnKeys) => {
  const getValue = (index) => (values) =>
    values.type ? sparkForm[values.type](columnKeys)[index] : null;
  return [
    {
      type: FIELDS.singleSelect,
      name: "type",
      label: "Spark Type",
      options: ["slack", "algolia", "sendGrid"],
      validation: yup.string().required("Required"),
    },
    getValue(0),
    getValue(1),
    getValue(2),
    getValue(3),
    getValue(4),
  ];
};

export const sparkForm = {
  algolia: (columnKeys: string[]) => {
    return [
      {
        type: FIELDS.text,
        name: "index",
        label: "Index Name",
        validation: yup.string().required("Required"),
      },
      {
        type: FIELDS.multiSelect,
        name: "fieldsToSync",
        label: "Fields to sync to Index",
        options: columnKeys,
        validation: yup.array().of(yup.string()).required("Required"),
      },
      {
        type: FIELDS.multiSelect,
        name: "requiredFields",
        label: `Required Fields (It won't sync if any is undefined)`,
        options: columnKeys,
      },
    ];
  },
  sendGrid: (columnKeys: string[]) => {
    return [
      labelField,
      triggerTypes,
      {
        type: FIELDS.text,
        name: "templateId",
        label: "Send Grid Template ID",
        validation: yup.string().required("Required"),
      },
      {
        type: FIELDS.multiSelect,
        name: "personalizationFields",
        label: `dynamic personalization`,
        options: columnKeys,
      },
      {
        type: FIELDS.multiSelect,
        name: "requiredFields",
        label: `Required Fields (It won't send if any is undefined)`,
        options: columnKeys,
      },
    ];
  },
  slack: (columnKeys) => {
    return [
      labelField,
      triggerTypes,
      {
        type: FIELDS.multiSelect,
        name: "requiredFields",
        label: `Required Fields (It won't send if any is undefined)`,
        options: columnKeys,
      },
      // {type:'code',name:'emails',label:'Target Emails',hint:'script that return an array of emails of users to send slack message to'},
      // {type:'code',name:'channels',label:'Target Channels',hint:'script that return an array of slack channels'},
      // {type:'code',name:'message',label:'Slack Message object',hint:'script that return an array of slack channels'},
    ];
  },
};
