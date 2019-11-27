import React from "react";
import MailIcon from "@material-ui/icons/MailOutline";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import SimpleTextIcon from "@material-ui/icons/TextFormat";
import LongTextIcon from "@material-ui/icons/Notes";
import PhoneIcon from "@material-ui/icons/Phone";
import ImageIcon from "@material-ui/icons/Photo";
import FileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AttachmentIcon from "@material-ui/icons/AttachFile";
import PalleteIcon from "@material-ui/icons/Palette";
import DateIcon from "@material-ui/icons/CalendarToday";
import TimeIcon from "@material-ui/icons/AccessTime";
import RatingIcon from "@material-ui/icons/StarHalf";
import URLIcon from "@material-ui/icons/Explore";
import NumberIcon from "@material-ui/icons/Looks3";
import propEq from "ramda/es/propEq";
import find from "ramda/es/find";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
export enum FieldType {
  simpleText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  richText = "RICH_TEXT",
  email = "EMAIL",
  PhoneNumber = "PHONE_NUMBER",
  checkBox = "CHECK_BOX",
  date = "DATE",
  dateTime = "DATE_TIME",
  number = "NUMBER",
  url = "URL",
  color = "COLOR",
  rating = "RATING",
  image = "IMAGE",
  file = "FILE",
  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",
  documentSelect = "DOCUMENT_SELECT",
  action = "ACTION",
  last = "LAST",
}

export const FIELDS = [
  { icon: <SimpleTextIcon />, name: "Simple Text", type: FieldType.simpleText },
  { icon: <LongTextIcon />, name: "Long Text", type: FieldType.longText },
  { icon: <MailIcon />, name: "Email", type: FieldType.email },
  { icon: <PhoneIcon />, name: "Phone", type: FieldType.PhoneNumber },
  { icon: <CheckBoxIcon />, name: "Check Box", type: FieldType.checkBox },
  { icon: <NumberIcon />, name: "Number", type: FieldType.number },
  { icon: <DateIcon />, name: "Date", type: FieldType.date },
  { icon: <TimeIcon />, name: "Time", type: FieldType.dateTime },
  { icon: <URLIcon />, name: "URL", type: FieldType.url },
  { icon: <RatingIcon />, name: "Rating", type: FieldType.rating },
  { icon: <ImageIcon />, name: "Image", type: FieldType.image },
  { icon: <AttachmentIcon />, name: "File", type: FieldType.file },
  { icon: <FileIcon />, name: "Single Select", type: FieldType.singleSelect },
  { icon: <FileIcon />, name: "Multi Select", type: FieldType.multiSelect },
  { icon: <FileIcon />, name: "Doc Select", type: FieldType.documentSelect },
  { icon: <FileIcon />, name: "Action", type: FieldType.action },
  { icon: <FileIcon />, name: "Rich Text", type: FieldType.richText },
  { icon: <PalleteIcon />, name: "Color", type: FieldType.color },
];

/**
 * returns icon associated with field type
 * @param fieldType
 */
export const getFieldIcon = (fieldType: FieldType) => {
  return find(propEq("type", fieldType))(FIELDS).icon;
};
/**
 * returns true if it receives an existing fieldType
 * @param fieldType
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map(field => field.type);
  return fieldTypes.includes(fieldType);
};

/**
 * Returns dropdown component of all available types
 */
export const FieldsDropDown = (value: FieldType | null, onChange: any) => {
  return (
    <Select
      value={value ? value : ""}
      onChange={onChange}
      inputProps={{
        name: "type",
        id: "type",
      }}
    >
      {FIELDS.map(
        (field: { icon: JSX.Element; name: string; type: FieldType }) => {
          return (
            <MenuItem
              key={`select-field-${field.name}`}
              id={`select-field-${field.type}`}
              value={field.type}
            >
              <>{field.name}</>
            </MenuItem>
          );
        }
      )}
    </Select>
  );
};
