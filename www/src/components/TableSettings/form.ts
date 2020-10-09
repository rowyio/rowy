import * as yup from "yup";
import { FIELDS } from "@antlerengineering/form-builder";
import { TableSettingsDialogModes } from "./index";
export const tableSettings = (
  mode: TableSettingsDialogModes | null,
  roles: string[] | undefined,
  sections: string[] | undefined
) => [
  {
    type: FIELDS.text,
    name: "name",
    label: "Table Name",
    validation: yup
      .string()
      .required("Required: its the label for identifying your table")
      .nullable(),
  },
  {
    type: FIELDS.text,
    name: "collection",
    label: "Collection Name",
    validation: yup
      .string()
      .required("Required: This is the Firestore collection name")
      .nullable(),
  },
  {
    type: FIELDS.singleSelect,
    name: "tableType",
    label: "Table Type",
    defaultValue: "primaryCollection",
    options: [
      { label: "Primary Collection", value: "primaryCollection" },
      { label: "Collection Group", value: "collectionGroup" },
    ],
    validation: yup.string().required("Required"),
    disabled: mode === TableSettingsDialogModes.update,
  },
  {
    type: FIELDS.multiSelect,
    name: "section",
    multiple: false,
    label: "Section",
    freeText: true,
    options: sections,
    validation: yup
      .string()
      .required(
        "Required: this helps in grouping your tables for better navigation"
      )
      .nullable(),
  },
  {
    type: FIELDS.text,
    name: "description",
    label: "Description",
    multiline: true,
    rowsMax: 3,
    placeholder: "Describe this table to the rest of the team",
    validation: yup.string(),
  },
  {
    type: FIELDS.multiSelect,
    name: "roles",
    label: "Accessed By",
    placeholder: "Who can access this table? Select roles",
    options: roles,
    validation: yup
      .array()
      .of(yup.string())
      .required(
        "Required: this only helps in showing this table to users with these roles, and does not modify the Firestore rules required to show the data"
      ),
    freeText: true,
  },
];
