import React from "react";
import propEq from "ramda/es/propEq";
import find from "ramda/es/find";

import ShortTextIcon from "@material-ui/icons/ShortText";
import LongTextIcon from "@material-ui/icons/Notes";
import EmailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";

import CheckboxIcon from "@material-ui/icons/CheckBox";
import NumberIcon from "assets/icons/Number";

import DateIcon from "@material-ui/icons/Today";
import DateTimeIcon from "@material-ui/icons/AccessTime";

import UrlIcon from "@material-ui/icons/Link";
import RatingIcon from "@material-ui/icons/StarBorder";

import ImageIcon from "@material-ui/icons/PhotoSizeSelectActual";
import FileIcon from "@material-ui/icons/AttachFile";

import SingleSelectIcon from "@material-ui/icons/FormatListBulleted";
import MultiSelectIcon from "assets/icons/MultiSelect";

import ConnectTableIcon from "assets/icons/ConnectTable";
import SubTableIcon from "assets/icons/SubTable";

import ActionIcon from "assets/icons/Action";
import JsonIcon from "assets/icons/Json";

import RichTextIcon from "@material-ui/icons/TextFormat";
import ColorIcon from "@material-ui/icons/Colorize";
import SliderIcon from "assets/icons/Slider";

export {
  ShortTextIcon,
  LongTextIcon,
  EmailIcon,
  PhoneIcon,
  CheckboxIcon,
  NumberIcon,
  DateIcon,
  DateTimeIcon,
  UrlIcon,
  RatingIcon,
  ImageIcon,
  FileIcon,
  SingleSelectIcon,
  MultiSelectIcon,
  ConnectTableIcon,
  SubTableIcon,
  ActionIcon,
  RichTextIcon,
  ColorIcon,
};

export enum FieldType {
  shortText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  phone = "PHONE_NUMBER",

  checkbox = "CHECK_BOX",
  number = "NUMBER",

  date = "DATE",
  dateTime = "DATE_TIME",

  url = "URL",
  rating = "RATING",

  image = "IMAGE",
  file = "FILE",

  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",

  connectTable = "DOCUMENT_SELECT",
  subTable = "SUB_TABLE",

  action = "ACTION",

  richText = "RICH_TEXT",
  color = "COLOR",
  slider = "SLIDER",

  json = "JSON",

  last = "LAST",
}

export const FIELDS = [
  { icon: <ShortTextIcon />, name: "Short Text", type: FieldType.shortText },
  { icon: <LongTextIcon />, name: "Long Text", type: FieldType.longText },
  { icon: <EmailIcon />, name: "Email", type: FieldType.email },
  { icon: <PhoneIcon />, name: "Phone", type: FieldType.phone },

  { icon: <CheckboxIcon />, name: "Checkbox", type: FieldType.checkbox },
  { icon: <NumberIcon />, name: "Number", type: FieldType.number },

  { icon: <DateIcon />, name: "Date", type: FieldType.date },
  { icon: <DateTimeIcon />, name: "Time & Date", type: FieldType.dateTime },

  { icon: <UrlIcon />, name: "URL", type: FieldType.url },
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
    type: FieldType.connectTable,
  },
  {
    icon: <SubTableIcon />,
    name: "Sub-table",
    type: FieldType.subTable,
  },

  { icon: <ActionIcon />, name: "Action", type: FieldType.action },

  { icon: <RichTextIcon />, name: "Rich Text", type: FieldType.richText },
  { icon: <ColorIcon />, name: "Color", type: FieldType.color },
  { icon: <SliderIcon />, name: "Slider", type: FieldType.slider },
  { icon: <JsonIcon />, name: "JSON", type: FieldType.json },
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
