import React from "react";
import MailIcon from "@material-ui/icons/MailOutline";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import SimpleTextIcon from "@material-ui/icons/TextFormat";
import LongTextIcon from "@material-ui/icons/Notes";
import PhoneIcon from "@material-ui/icons/Phone";
import ImageIcon from "@material-ui/icons/Photo";
import FileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import DateIcon from "@material-ui/icons/CalendarToday";
import TimeIcon from "@material-ui/icons/AccessTime";
import RatingIcon from "@material-ui/icons/StarHalf";
import URLIcon from "@material-ui/icons/Explore";
import NumberIcon from "@material-ui/icons/Looks3";
import propEq from "ramda/es/propEq";
import find from "ramda/es/find";
export enum FieldType {
  simpleText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  PhoneNumber = "PHONE_NUMBER",
  checkBox = "CHECK_BOX",
  date = "DATE",
  dateTime = "DATE_TIME",
  number = "NUMBER",
  url = "URL",
  rating = "RATING",
  image = "IMAGE",
  file = "FILE",
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
  { icon: <FileIcon />, name: "File", type: FieldType.file },
];

export const getFieldIcon = (type: FieldType) => {
  return find(propEq("type", type))(FIELDS).icon;
};
