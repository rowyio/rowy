import React from "react";
import propEq from "ramda/es/propEq";
import find from "ramda/es/find";

import ShortTextIcon from "@material-ui/icons/ShortText";
import LongTextIcon from "@material-ui/icons/Notes";
import EmailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";

import CheckboxIcon from "@material-ui/icons/CheckBox";
import NumberIcon from "assets/icons/Number";
import PercentageIcon from "assets/icons/Percentage";

import DateIcon from "@material-ui/icons/Today";
import DateTimeIcon from "@material-ui/icons/AccessTime";
import DurationIcon from "@material-ui/icons/Timer";

import UrlIcon from "@material-ui/icons/Link";

import RatingIcon from "@material-ui/icons/StarBorder";

import ImageIcon from "@material-ui/icons/PhotoSizeSelectActual";
import FileIcon from "@material-ui/icons/AttachFile";

import SingleSelectIcon from "@material-ui/icons/FormatListBulleted";
import WebServiceIcon from "@material-ui/icons/Http";

import MultiSelectIcon from "assets/icons/MultiSelect";

import ConnectTableIcon from "assets/icons/ConnectTable";
import SubTableIcon from "assets/icons/SubTable";

import ActionIcon from "assets/icons/Action";
import JsonIcon from "assets/icons/Json";
import CodeIcon from "@material-ui/icons/Code";
import DerivativeIcon from "assets/icons/Derivative";
import AggregateIcon from "@material-ui/icons/Layers";

import RichTextIcon from "@material-ui/icons/TextFormat";
import ColorIcon from "@material-ui/icons/Colorize";
import SliderIcon from "assets/icons/Slider";
import UserIcon from "@material-ui/icons/Person";

export {
  ShortTextIcon,
  LongTextIcon,
  EmailIcon,
  PhoneIcon,
  CheckboxIcon,
  NumberIcon,
  PercentageIcon,
  DateIcon,
  DateTimeIcon,
  DurationIcon,
  UrlIcon,
  RatingIcon,
  ImageIcon,
  FileIcon,
  SingleSelectIcon,
  MultiSelectIcon,
  ConnectTableIcon,
  SubTableIcon,
  ActionIcon,
  JsonIcon,
  CodeIcon,
  DerivativeIcon,
  AggregateIcon,
  RichTextIcon,
  ColorIcon,
  SliderIcon,
  UserIcon,
  WebServiceIcon,
};

export enum FieldType {
  shortText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  phone = "PHONE_NUMBER",

  checkbox = "CHECK_BOX",
  number = "NUMBER",
  percentage = "PERCENTAGE",

  date = "DATE",
  dateTime = "DATE_TIME",
  duration = "DURATION",

  url = "URL",
  rating = "RATING",

  image = "IMAGE",
  file = "FILE",

  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",

  connectService = "SERVICE_SELECT",
  connectTable = "DOCUMENT_SELECT",
  subTable = "SUB_TABLE",

  action = "ACTION",
  json = "JSON",
  code = "CODE",
  derivative = "DERIVATIVE",
  aggregate = "AGGREGATE",

  richText = "RICH_TEXT",
  color = "COLOR",
  slider = "SLIDER",
  user = "USER",

  last = "LAST",
}

export const FIELDS = [
  { icon: <ShortTextIcon />, name: "Short Text", type: FieldType.shortText },
  { icon: <LongTextIcon />, name: "Long Text", type: FieldType.longText },
  { icon: <EmailIcon />, name: "Email", type: FieldType.email },
  { icon: <PhoneIcon />, name: "Phone", type: FieldType.phone },

  { icon: <CheckboxIcon />, name: "Checkbox", type: FieldType.checkbox },
  { icon: <NumberIcon />, name: "Number", type: FieldType.number },
  { icon: <PercentageIcon />, name: "Percentage", type: FieldType.percentage },

  { icon: <DateIcon />, name: "Date", type: FieldType.date },
  { icon: <DateTimeIcon />, name: "Time & Date", type: FieldType.dateTime },
  { icon: <DurationIcon />, name: "Duration", type: FieldType.duration },

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
    icon: <SubTableIcon />,
    name: "Sub-table",
    type: FieldType.subTable,
  },
  {
    icon: <ConnectTableIcon />,
    name: "Connect Table",
    type: FieldType.connectTable,
  },
  {
    icon: <WebServiceIcon />,
    name: "Webservice Select",
    type: FieldType.connectService,
  },

  { icon: <JsonIcon />, name: "JSON", type: FieldType.json },
  { icon: <CodeIcon />, name: "Code", type: FieldType.code },

  { icon: <ActionIcon />, name: "Action", type: FieldType.action },
  { icon: <DerivativeIcon />, name: "Derivative", type: FieldType.derivative },
  { icon: <AggregateIcon />, name: "Aggregate", type: FieldType.aggregate },

  { icon: <RichTextIcon />, name: "Rich Text", type: FieldType.richText },
  { icon: <ColorIcon />, name: "Color", type: FieldType.color },
  { icon: <SliderIcon />, name: "Slider", type: FieldType.slider },
  { icon: <UserIcon />, name: "User", type: FieldType.user },
];

export const FIELD_TYPE_DESCRIPTIONS = {
  [FieldType.shortText]: "Small amount of text, such as names and taglines.",
  [FieldType.longText]:
    "Large amount of text, such as sentences and paragraphs.",
  [FieldType.email]: "Email address. Firetable does not validate emails.",
  [FieldType.phone]:
    "Phone numbers stored as text. Firetable does not validate phone numbers.",

  [FieldType.checkbox]: "Either checked or unchecked. Unchecked by default.",
  [FieldType.number]: "Numeric data.",
  [FieldType.percentage]: "Percentage stored as a number between 0 and 1.",

  [FieldType.date]:
    "Date displayed and input as YYYY/MM/DD or input using a picker module.",
  [FieldType.dateTime]:
    "Time and Date can be written as YYYY/MM/DD hh:mm (am/pm) or input using a picker module.",
  [FieldType.duration]: "Duration calculated from two timestamps.",

  [FieldType.url]: "Web address. Firetable does not validate URLs.",
  [FieldType.rating]:
    "Rating displayed as stars from 0 to configurable number of stars(5 by default).",

  [FieldType.image]:
    "Image file uploaded to Firebase Storage. Supports JPEG, PNG, SVG, GIF, WebP.",
  [FieldType.file]:
    "File uploaded to Firebase Storage. Supports any file type.",

  [FieldType.singleSelect]:
    "Dropdown selector with searchable options and radio button behaviour. Optionally allows users to input custom values. Max selection: 1 option.",
  [FieldType.multiSelect]:
    "Dropdown selector with searchable options and check box behaviour. Optionally allows users to input custom values. Max selection: all options.",

  [FieldType.connectTable]:
    "Connects to an existing table to fetch a snapshot of values from a row. Requires Algolia integration.",
  [FieldType.connectService]: "Select a value from a list of websevice results",
  [FieldType.subTable]:
    "Creates a sub-table. Also displays number of rows inside the sub-table. Max sub-table levels: 100.",

  [FieldType.action]:
    "A button with a pre-defined action. Triggers a Cloud Function. 3 different states: Disabled, Enabled, Active (Clicked). Supports Undo and Redo.",
  [FieldType.json]: "JSON object editable with a visual JSON editor.",
  [FieldType.code]: "Raw code editable with Monaco Editor.",
  [FieldType.derivative]:
    "Value derived from the rest of the row’s values. Displayed using any other field type. Requires Cloud Function setup.",
  [FieldType.aggregate]:
    "Value aggregated from a specified subcollection of the row. Displayed using any other field type. Requires Cloud Function setup.",

  [FieldType.richText]: "Rich text editor with predefined HTML text styles.",
  [FieldType.color]: "Visual color picker. Supports Hex, RGBA, HSLA.",
  [FieldType.slider]: "Slider with adjustable range. Returns a numeric value. ",
  [FieldType.user]: "Used to display _ft_updatedBy field for editing history",

  [FieldType.last]: "Internally used to display last column with row actions.",
};

/**
 * Returns icon associated with field type
 * @param fieldType
 */
export const getFieldIcon = (fieldType: FieldType) => {
  const field: any = find(propEq("type", fieldType))(FIELDS);
  return field.icon;
};

/**
 * Returns `true` if it receives an existing fieldType
 * @param fieldType
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map((field) => field.type);
  return fieldTypes.includes(fieldType);
};

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/gif",
  "image/webp",
];
