import React from "react";
import propEq from "ramda/es/propEq";
import find from "ramda/es/find";

import SimpleTextIcon from "@material-ui/icons/ShortText";
import LongTextIcon from "@material-ui/icons/Notes";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import NumberIcon from "assets/icons/Number";

import DateIcon from "@material-ui/icons/Today";
import TimeIcon from "@material-ui/icons/AccessTime";

import URLIcon from "@material-ui/icons/Link";
import RatingIcon from "@material-ui/icons/StarBorder";

import ImageIcon from "@material-ui/icons/PhotoSizeSelectActual";
import FileIcon from "@material-ui/icons/AttachFile";

import SingleSelectIcon from "@material-ui/icons/FormatListBulleted";
import MultiSelectIcon from "assets/icons/MultiSelect";

import ConnectTableIcon from "assets/icons/ConnectTable";
import SubTableIcon from "assets/icons/SubTable";

import ActionIcon from "assets/icons/Action";

import RichTextIcon from "@material-ui/icons/TextFormat";
import ColorIcon from "@material-ui/icons/Colorize";

export enum FieldType {
  simpleText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  PhoneNumber = "PHONE_NUMBER",

  checkBox = "CHECK_BOX",
  number = "NUMBER",

  date = "DATE",
  dateTime = "DATE_TIME",

  url = "URL",
  rating = "RATING",

  image = "IMAGE",
  file = "FILE",

  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",
  documentSelect = "DOCUMENT_SELECT",
  subTable = "SUB_TABLE",

  action = "ACTION",

  richText = "RICH_TEXT",
  color = "COLOR",
  slider = "SLIDER",

  last = "LAST",
}

export const FIELDS = [
  { icon: <SimpleTextIcon />, name: "Short Text", type: FieldType.simpleText },
  { icon: <LongTextIcon />, name: "Long Text", type: FieldType.longText },
  { icon: <MailIcon />, name: "Email", type: FieldType.email },
  { icon: <PhoneIcon />, name: "Phone", type: FieldType.PhoneNumber },

  { icon: <CheckBoxIcon />, name: "Checkbox", type: FieldType.checkBox },
  { icon: <NumberIcon />, name: "Number", type: FieldType.number },

  { icon: <DateIcon />, name: "Date", type: FieldType.date },
  { icon: <TimeIcon />, name: "Time & Date", type: FieldType.dateTime },

  { icon: <URLIcon />, name: "URL", type: FieldType.url },
  { icon: <RatingIcon />, name: "Rating", type: FieldType.rating },

  { icon: <ImageIcon />, name: "Image", type: FieldType.image },
  { icon: <FileIcon />, name: "File", type: FieldType.file },

  {
    icon: <SingleSelectIcon />,
    name: "Single Select",
    type: FieldType.singleSelect,
  },
  {
    icon: <MultiSelectIcon />,
    name: "Multi Select",
    type: FieldType.multiSelect,
  },

  {
    icon: <ConnectTableIcon />,
    name: "Connect Table",
    type: FieldType.documentSelect,
  },
  {
    icon: <SubTableIcon />,
    name: "Sub-table",
    type: FieldType.subTable,
  },

  { icon: <ActionIcon />, name: "Action", type: FieldType.action },

  { icon: <RichTextIcon />, name: "Rich Text", type: FieldType.richText },
  { icon: <ColorIcon />, name: "Color", type: FieldType.color },
  { icon: <ActionIcon />, name: "Slider", type: FieldType.slider },
];

/**
 * Returns icon associated with field type
 * @param fieldType
 */
export const getFieldIcon = (fieldType: FieldType) => {
  return find(propEq("type", fieldType))(FIELDS).icon;
};

/**
 * Returns `true` if it receives an existing fieldType
 * @param fieldType
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map(field => field.type);
  return fieldTypes.includes(fieldType);
};
